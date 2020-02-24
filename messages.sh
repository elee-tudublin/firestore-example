#!/bin/bash
#
# for this simple example we use a local mosquitto broker
# the while will stay in the subscribe loop and act on any messages rxed
#
#vars
#
# Firebase Vars - from app settings
PROJECT_ID='y2proj-messaging'
COLLECTION_ID='messages'
API_KEY='AIzaSyB-2gGJgQErbyOiipXGq3CgoLgB4DUgSsE'
TOKEN=''

# Firestore rules to allow read/write
# https://firebase.google.com/docs/firestore/security/get-started

# Build the URL to which data will be sent
# This uses the app settings defined above
FIRESTORE_URL="https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/$COLLECTION_ID?&key=$API_KEY"
# check url
echo $FIRESTORE_URL

# HTTP Header parameters
# Data will be JSON
REQ_HEADER='content-type: application/json'
# Auth Token if required
AUTH_HEADER="Authorization: Bearer $TOKEN"
# Saving data to API via POST request 
REQ_METHOD='POST'

#
# do the mosq subscribe and loop around handling any inputs that come in
#
mosquitto_sub -v -h localhost -t myapp/# | while read line
do
        # first all we do is echo the line (topic + message) to the screen
        echo $line

        # assume topic has 3 fields in form field1/field2/field3
        # cut them out of the topic and put into column vars 1-3
        column1=`echo $line|cut -f2 -d/`
        echo $column1
        column2=`echo $line|cut -f3 -d/`
        echo $column2

	# column will contain the last part of the topic and the entire message
	# so we parse out the msg and the actual col3 last part of the topic
        column3=`echo $line|cut -f4 -d/`
        msg=`echo $column3|cut -f2- -d' '`
        column3=`echo $column3|cut -f1 -d' '`
        echo $column3

        # now we work on the message
        # assume message has 3 fields in form field1,field2,field3
        # cut them out of the msg and put into column vars 4-6
        msg=`echo $line|cut -f2 -d' '`
        column4=`echo $msg|cut -f1 -d,`
        echo $column4
        column5=`echo $msg|cut -f2 -d,`
        echo $column5
        column6=`echo $msg|cut -f3 -d,`
        echo $column6
        #
        # now we work on the DB, we want to out the columns(1-6) into the DB
        #
        # generate date stamp
        now=`date`
        # Data to be sent in JSON format
        JSON='{"fields": {"createdAt": {"stringValue": "'"$now"'"}, "sender": {"stringValue": "'"$column4"'"},
          "recipient": {"stringValue": "'"$column5"'"}, "message": {"stringValue": "'"$column6"'"}}}'

        # some Debug output next
        echo $JSON
        # https://askubuntu.com/questions/1162945/how-to-send-json-as-variable-with-bash-curl

        # Use CURL to send POST request + data
        response=$(curl -X $REQ_METHOD  -H "$REQ_HEADER" --data "$JSON" $FIRESTORE_URL)

        # Show response
        echo $response
done

# to test

# this script
# ./messages.sh 

# to publish
# mosquitto_pub -h localhost -t tudmyapp/col1/col2/col3/ -m test1,test2,test3

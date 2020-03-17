#!/bin/bash
#
# we can use a local mosquitto broker OR a web based one (local commented out below)
# the while will stay in the subscribe loop and act on any messages rxed
#
#vars
#
# Firebase Vars - from app settings
PROJECT_ID='y2proj-messaging'
COLLECTION_ID='messages'
API_KEY=''
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
# mosquitto_sub -v -h localhost -t myapp/# | while read line
mosquitto_sub -v -h broker.hivemq.com -t messageapp/# | while read line
do
        # first all we do is echo the line (topic + message) to the screen
        echo $line

        # assume topic has 4 fields in form field1/field2/field3/field4
        # cut them out of the topic and put into column vars 1-4
        column1=`echo $line|cut -f2 -d/`
        echo $column1
        column2=`echo $line|cut -f3 -d/`
        echo $column2
        column3=`echo $line|cut -f4 -d/`
        echo $column3
        column4=`echo $line|cut -f5 -d/`
        echo $column4
        column5=`echo $line|cut -f6 -d/`
        echo $column5             

        # now we work on the message
        # assume message has 3 fields in form field1,field2,field3
        # cut them out of the msg and put into column vars 4-6
        msg=`echo $line|cut -f2 -d' '`
        column6=`echo $msg|cut -f1 -d,`
        echo $column6
        column7=`echo $msg|cut -f2 -d,`
        echo $column7
        column8=`echo $msg|cut -f3 -d,`
        echo $column8
        column9=`echo $msg|cut -f4 -d,`
        echo $column9
        #
        # now we work on the DB, we want to out the columns(1-6) into the DB
        #
        # generate date stamp
        now=`date`
        # Data to be sent in JSON format
        JSON='{"fields": {"createdAt": {"stringValue": "'"$now"'"}, "sender": {"stringValue": "'"$column6"'"}, "subject": {"stringValue": "'"$column8"'"}, "message": {"stringValue": "'"$column9"'"}}}'
        
        # https://askubuntu.com/questions/1162945/how-to-send-json-as-variable-with-bash-curl

        # Use CURL to send POST request + data
        response=$(curl -X $REQ_METHOD  -H "$REQ_HEADER" --data "$JSON" $FIRESTORE_URL)

        # Show response
        echo $response
done

# test

# this script
# ./messages.sh messageapp/sender/createdAt/subject/message -m me,today,subject,message

# pub
# mosquitto_pub -h broker.hivemq.com -t messageapp/sender/createdAt/subject/message -m me,today,subject,message
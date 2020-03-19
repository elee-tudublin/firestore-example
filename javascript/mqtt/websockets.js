// Based on Paho MQTT Websocket examples for JavaScript
// https://github.com/eclipse/paho.mqtt.javascript


// var for mqqt object instance
let mqtt;
const reconnectTimeout = 2000;
// Websocket host
const host = 'broker.hivemq.com';
// Websocket port
const port = 8000;
// Message delimiter char
const msgDelimiter = ',';

const subTopic = 'messageapp/#';

const defaultDestinationTopic = 'messageapp/sender/createdAt/subject/message';

// moment used to generate date 
const testMessage = `me@me.com${msgDelimiter}${moment().format('llll').replace(/,/g, ' ')}${msgDelimiter}subject${msgDelimiter}message`;

// Page element ref for messages
let messageList = document.getElementById("messageList");

// Attempt connect to mqtt via websocket
function MQTTconnect() {
  // Log nessage to console
  console.log(`connecting to ${host}:${port}`);

  // Get mqtt instance
  mqtt = new Paho.MQTT.Client(host, port, "clientjs");
  const options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure
  };
  mqtt.onMessageArrived = onMessageArrived;

  mqtt.connect(options); //connect
}

// on sucessful connect to mqtt over websocket
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.

  mqtt.subscribe(subTopic);

  // send a test message
  message = new Paho.MQTT.Message(testMessage);
  message.destinationName = defaultDestinationTopic;
  mqtt.send(message);

  console.log('Connected');
}

// Handle errors
function onFailure(message) {
  // Log error in console
  console.log(`Connection Attempt to Host ${host} Failed`);
  setTimeout(MQTTconnect, reconnectTimeout);
}

// When a message is recieved on websocket connection
function onMessageArrived(message) {
  const topic = message.destinationName;
  const payload = message.payloadString;

  // Split payload string into an array
  const msgArr = payload.split(msgDelimiter);

  // Add to the page by adding to start ofthe page element 
  messageList.innerHTML = `<li class="list-group-item">
                              <b>Date:</b> ${msgArr[1]}
                              <b>From:</b> ${msgArr[0]}
                              <b>Subject:</b> ${msgArr[2]}
                              <b>Message:</b> ${msgArr[3]}
                          </li>
  ${messageList.innerHTML}`;
}

// Send a message when form is submitted
function sendMessage() {

  // Read values from form
  const topic = document.getElementById("topic").value;
  const sender = document.getElementById("sender").value;
  const subject = document.getElementById("subject").value;
  const messageText = document.getElementById("messageText").value; 

  // Construct message
  const payload = `'${sender}'${msgDelimiter}'${moment().format('llll').replace(/,/g, ' ')}'${msgDelimiter}'${subject}'${msgDelimiter}'${messageText}'`;
  console.log(`playload: ${payload}`)
  message = new Paho.MQTT.Message(payload);
  message.destinationName = topic;
  // Send message via websocket
  mqtt.send(message);   

  // Prevent browser from reseting page after submit has been handled
  return false;
}

// Connect mqtt
MQTTconnect();
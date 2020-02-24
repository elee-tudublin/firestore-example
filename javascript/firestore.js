
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// name of the the Firebase collection to be used
const FB_COLLECTION = "messages";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Get a reference to the database service
let database = firebase.firestore();

/*
    Get all messages
*/
async function getMessagesAsync(FB_COLLECTION) {
    // Declare empty array
    let messages = [];
  
    // await calls must be made in try-catch blocks
    try {
      // Get a snapshot of the products collection
      let snapshot = await database.collection(FB_COLLECTION).get();
  
      // use map() to retrieve product document objects from the snapshot - storing each in the array
      // map returns each document from the firestore snapshot
      messages = snapshot.docs.map(doc => {
        return doc;
      });
    } catch (err) {
      // catch errors
      console.log(err);
    }
  
    // return the messages array
    return messages;
  }

/*
    Get single message by id from a firebase collection
*/
async function getMessageByIdAsync(FB_COLLECTION, id) {
    // Declare empty product
    let message;
  
    // await calls must be made in try-catch blocks
    try {
      // Get product document which matches id
      product = await database.doc(`${FB_COLLECTION}/${id}`).get();
  
    } catch (err) {
      // catch errors
      console.log(err);
    }
  
    // return the products array
    return message;
  }


  /*
    Delete single message by id from a firebase collection
*/
async function deleteMessageByIdAsync(fb_collection, id) {
  
    // await calls must be made in try-catch blocks
    try {
      // Get product document which matches id
      await database.doc(`${fb_collection}/${id}`).delete();
      return true;
  
    } catch (err) {
      // catch errors
      console.log(err);
    }
  
    return false;
  }
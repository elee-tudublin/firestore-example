
// name of the the Firebase collection to be used
const FB_COLLECTION = "messages";

// page element where rows will be inserted 
const messageRows = document.getElementById('messageRows');

// Get JSON array of messages
// Async call
  async function getMessages() {
    try {
      const messages = await getMessagesAsync(FB_COLLECTION);
      displayMessages(messages);
      //console.log(messages);
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }

async function displayMessages(messages) {

  // clear existing rows - otherwise items will be repeated
  messageRows.innerHTML = '';

  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.
  const tableRows = messages.map(msg => {
    return `<tr>
          <td>${msg.id}</td>
          <td>${msg.data().createdAt}</td>
          <td>${msg.data().sender}</td>
          <td>${msg.data().recipient}</td>
          <td>${msg.data().message}</td>
          <td>
            <button class="btn btn-xs" onclick="deleteMessage('${msg.id}')"><span class="oi oi-trash"></span></button>
          </td>
      </tr>`;
  });

  messageRows.innerHTML = tableRows.join('');

  // 1. Get array of buttons
  let  delButtons = messageRows.getElementsByTagName("button");

  // 2. Assign a 'click' event listener to each button
  // the calaculate function will be called when a button is clicked
  for (let i = 0; i < delButtons.length; i++) {
    delButtons[i].addEventListener("click", deleteMessage);
  }
}


// Delete a message by id
// note the method and headers must be set
async function deleteMessage(id) {

  if (confirm("Are you sure?")) {

    try {
      result = await deleteMessageByIdAsync(FB_COLLECTION, id);

    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }
  if (result === true) {
    // Log the status - view in the console
    // View browser console for details
    console.log(`Message with id ${id} was deleted`);
    // reload the data (to add new item)
    getMessages();
  } else {
    console.log(`Not deleted: message with id ${id}`);
  }
}


// Update page with AJAX call ever 5000ms
function doPoll(){
  getMessages();
  setTimeout(doPoll,5000);
}


// Load data
getMessages();
doPoll();
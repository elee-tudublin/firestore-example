
// page element where rows will be inserted 
const messageRows = document.getElementById('messageRows');

// Get JSON array of messages
// Async call
  async function getMessages() {
    try {
      const messages = await getMessagesAsync();
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
          <td>${msg.data().subject}</td>
          <td>${msg.data().message}</td>
          <td>
            <button class="btn btn-xs" onclick="deleteMessage('${msg.id}')"><span class="oi oi-trash"></span></button>
          </td>
      </tr>`;
  });

  // Insert the rows into the table body 
  // join() Convert tableRows array to a string
  // join('') replaces the default , seperator with blank
  messageRows.innerHTML = tableRows.join('');
}


// Delete a message by id
// note the method and headers must be set
async function deleteMessage(id) {

  if (confirm("Are you sure?")) {

    try {
      result = await deleteMessageByIdAsync(id);

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
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '1065409891182-le53cj85r9a72793r98ejsgokvrlhdmi.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    callScriptFunction();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Calls an Apps Script function to list the folders in the user's
 * root Drive folder.
 */
function callScriptFunction() {
  //var scriptId = "ENTER_YOUR_SCRIPT_ID_HERE";
  var scriptId = 'MUoKVF3nPOzeho-5GG-JACsZSlYLOBAKV';

  // Create an execution request object.
  var request = {
    //'function': 'getFoldersUnderRoot'
    'function': 'myFunction',
    'parameters': [
      {'name': 'prueba'}
    ]
  };



  // Make the API request.
  var op = gapi.client.request({
    'root': 'https://script.googleapis.com',
    'path': 'v1/scripts/' + scriptId + ':run',
    'method': 'POST',
    'body': request
  });

  op.execute(function(resp) {
    if (resp.error && resp.error.status) {
      // The API encountered a problem before the script
      // started executing.
      appendPre('Error calling API:');
      appendPre(JSON.stringify(resp, null, 2));
    } else if (resp.error) {
      // The API executed, but the script returned an error.

      // Extract the first (and only) set of error details.
      // The values of this object are the script's 'errorMessage' and
      // 'errorType', and an array of stack trace elements.
      var error = resp.error.details[0];
      appendPre('Script error message: ' + error.errorMessage);

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start
        // executing.
        appendPre('Script error stacktrace:');
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          appendPre('\t' + trace.function + ':' + trace.lineNumber);
        }
      }
    } else {
      // The structure of the result will depend upon what the Apps
      // Script function returns. Here, the function returns an Apps
      // Script Object with String keys and values, and so the result
      // is treated as a JavaScript object (folderSet).
      console.log(resp);
      var folderSet = resp.response.result;
      if (Object.keys(folderSet).length == 0) {
        appendPre('No folders returned!');
      } else {
        appendPre('Folders under your root folder:');
        Object.keys(folderSet).forEach(function(id){
          appendPre('\t' + folderSet[id] + ' (' + id  + ')');
        });
      }
    }
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

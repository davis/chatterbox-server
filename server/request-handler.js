/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var messages = []; // initialize messages array
var idCounter = 1; // start message counter at 1

var handleRequest = function(request, response) {


  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  var statusCode;
  // GET ============================
  if(request.method === 'GET') {
    response.writeHead(200, headers);
    response.end(JSON.stringify({results: messages}));

  // POST ===========================
  } else if(request.method === 'POST') {
    statusCode = 201;
    var data = "";
    request.on('data', function(partialData) { // data comes in 8k chunks
      data += partialData;
    });
    request.on('end', function() { // only at the end of the request do we parse out the message
      var message = JSON.parse(data);
      message.objectId = idCounter++; // give the message a object ID; Math.random() doesn't work for some reason...
      message.createdAt = Date.now(); // give the message a createdAt property
      messages.unshift(message); // add message to beginning of messages array

      response.writeHead(201, headers);
      response.end(JSON.stringify({results: messages})); // TO-DO: what do we want to send back?
    });

  // OPTIONS ========================
  } else if(request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();

  // 404 ============================
  } else {
    statusCode = 404;
  }

};

exports.handleRequest = handleRequest;

var url = require("url");
var path = require("path");
var messages = messages || [];

exports.handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  function route(request) {
    var statusCode;
    if(request.method === 'GET') {
      statusCode = 200;
    } else /*if(request.method === 'POST')*/ {
      statusCode = 201;
      request.on('data', function(data) {
        data = JSON.parse(data);
        data.createdAt = Date.now();
        data.objectId = Math.random() + "id";
        messages.unshift(data);
        console.log(messages)
      });
    }
    return statusCode;
  }

  var mPath = url.parse(request.url).pathname;
  var fPath = path.join(process.cwd(), mPath);
  path.exists(fPath, function(exists){
    if(!exists) {
      statusCode = 404;
    }
  });

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(route(request), headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end(JSON.stringify({results: messages}));
};

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

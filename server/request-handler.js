var url = require("url");

var messages = [];

var handleRequest = function(request, response) {
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



  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  response.writeHead(route(request), headers);

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;

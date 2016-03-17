'use strict'

var http = require('http');
var querystring = require('querystring');
var merkle_base = require('merkle-tree');

var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type':'text/plain'});
	response.end("Hello, I'm the server!");
}).listen(8080);

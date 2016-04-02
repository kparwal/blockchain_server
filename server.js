'use strict'
var http = require('http');
var querystring = require('querystring');
var merkle_base = require('merkle-tree');
var express = require('express');
var mongo_client = require('mongodb');
var python_shell = require('python-shell');
var assert = require('assert');
var app = express();
var block_num = 0; //persistence required across runs
var buffer = [];
//Connect to mongodb

var url = 'mongodb://localhost:27017/test';
mongo_client.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server.");
	db.close();
});

//Create merkle tree
var config = new merkle_base.Config({N:4, M:16});
var current_tree = new merkle_base.MemTree(config);

//Message created
app.post('/', function (request, response) {
	console.log(request);
	response.end('Received POST request!');
});

//Commit merkle tree to mongodb, write hash to blockchain, store txid with merkle root
var interval = setInterval(function() {
	//save tree to mongodb and get root
	
	//write hash to blockchain
	
	//retrieve txid and store with merkle root
},1000*60*60*24);

//complete message, commit to merkle tree
app.post('/complete', function (request, response) {
	//find message in buffer list

	//complete message with new information
	
	//write tree to mongo
});

//Is my information in this merkle tree?
app.get('/verify', function (request, response) {
	//grab tree from block_num
	
	//search tree for information
	
	//return success or failure
});

app.listen(8080);

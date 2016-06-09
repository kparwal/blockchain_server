'use strict'
var http = require('http');
var crypto = require('crypto');
var hash = crypto.createHash('sha256');
var merkle_tree = require('./merkle.js');
var express = require('express');
var mongo_client = require('mongodb');
var python_shell = require('python-shell');
var assert = require('assert');
var moment = require('moment');
var uuid = require('node-uuid');
var hashmap = require('hashmap');
var body_parser = require('body-parser');
var app = express();
var message_base = require('./message.js');
var block_num = 0; //persistence required across runs
var buffer = new hashmap();
//Connect to mongodb
app.use(body_parser.urlencoded({ extended: false }));
var url = 'mongodb://localhost:27017/test';
mongo_client.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});

//Create merkle tree
//var config = new merkle_base.Config({N:4, M:16});
//var current_tree = new merkle_base.MemTree(config);
var current_tree = new merkle_tree();

//Message created
app.post('/', function (request, response) {
    //console.log(request);
    var userid = uuid.v1();
    var fname = request.body.fname;
    var lname = request.body.lname;
    var key_hash = request.body.key_hash;
    var message = new message_base(userid, fname, lname, key_hash);
    message.timestamp(moment());
    buffer.set(userid, message);
    response.end(userid);
});

//complete message, commit to merkle tree
app.post('/complete', function (request, response) {
    //find message in buffer list
    var message = buffer.get(request.body.userid);
    //complete message with new information
    message.complete(request.body.pub_key, request.body.vid_url);
    message.timestamp(moment());
    //write message to tree
    //current_tree.upsert({
    //    'key': hash_func(message),
    //    'value': message.userid
    //});
    current_tree.add(message.userid, message);
    //current_tree.find({
    //  'key': message.uuid
    //}, function (err, value) {
    //  if(err) {
    //      console.log("bad tree!")
    //  } else {
    //      assert.equal(value, message);
    //      console.log("IT PROBABLY WORKS");
    //  }
    //});
    //if (current_tree.find(message.userid)) {
     //   console.log("IT PROBABLY WORKS");
    //}
    response.sendStatus(200);
});

//Is my information in this merkle tree?
app.get('/verify', function (request, response) {
    //grab tree from block_num
    var tree = something;
    //search tree for information
    var ok = tree.find(request.body.userid);
    //return success or failure
    if (ok) {
        response.sendStatus(200);
    } else {
        response.sendStatus(204);
    }
});

//Commit merkle tree to mongodb, write hash to blockchain, store txid with merkle root
var interval = setInterval(function() {
    //write hash to blockchain
    var root = current_tree.root();
    var config = {
        args = [root]
    };
    python_shell("python-OP_RETURN\\store-OP_RETURN", config, function (err, results){
        if (err) {
            console.log("Python Error");
        } else {
            console.log("txid" + results);
        }
    });
    //retrieve txid and store with merkle root

    //save tree to mongodb and get root
    var merkle_root = null;
}, 1000*60*60*24);

var hash_func = function (data) {
    var buffer_data = JSON.stringify(data);
    hash.update(buffer_data);
    var digest = hash.digest('hex');
    return digest;
};

app.listen(8080);

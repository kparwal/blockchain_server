'use strict'

var message = function (userid, fname, lname, hash){
	this.userid = userid;
	this.fname = fname;
	this.lname = lname;
	this.key_hash = hash;
	this.timestamps = [];
};

message.prototype.timestamp = function(timestamp) {
	this.timestamps.push(timestamp);
};

message.prototype.complete = function (timestamp) {
	this.pub_key = key;
	this.vid_url = url;
};

exports.message = message;

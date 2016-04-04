'use strict'

var message = function (userid, fname, lname, key_hash){
	this.userid = userid;
	this.fname = fname;
	this.lname = lname;
	this.key_hash = key_hash;
	this.timestamps = [];
};

message.prototype.timestamp = function(timestamp) {
	this.timestamps.push(timestamp);
};

message.prototype.complete = function (key, url) {
	this.pub_key = key;
	this.vid_url = url;
};

module.exports = message;

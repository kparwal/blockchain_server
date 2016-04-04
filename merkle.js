'use strict'
var crypto = require('crypto');

var hash_one = function (data) {
	var hash = crypto.createHash('sha256');
	var buffer_data = JSON.stringify(data);
	hash.update(buffer_data);
    var digest = hash.digest('hex');
    return digest;
}

var hash_two = function (data1, data2) {
	var hash = crypto.createHash('sha256');
	var buffer_data1 = JSON.stringify(data1);
	var buffer_data2 = JSON.stringify(data2);
	hash.update(buffer_data1);
	hash.update(buffer_data2);
    var digest = hash.digest('hex');
    return digest;
}

var data_node = function (key, data, index) {
	this.key = key;
	this.data = data;
	this.index = index;
};

var hash_node = function (hash, index, single) {
	this.hash = hash;
	this.index = index;
	this.single = single;
	this.is_root = false;
};

var merkle = function () {
	this.data_list = [];
	this.tree_list = [];
	this.root = [];
};

merkle.prototype.add = function(key, data) {
	var node = new data_node(key, data, this.data_list.length);
	this.data_list.push(node);
	return this.rehash_tree();
};

var get_parent = function(n) {
	return Math.floor(n / 2);
};

var is_orphan = function(n, len) {
	return (n%2 == 0) && (n == len);
}

merkle.prototype.rehash_tree = function () {
	var datalist = this.data_list;
	var not_root = true;
	var hashlist = [];
	this.tree_list = [];
	for (var i = 0; i < datalist.length; i++) {
		var hashnode = new hash_node(hash_one(datalist[i]), i, is_orphan(i, datalist.length));
		hashlist.push(hashnode);
	}
	this.tree_list.push(hashlist);
	datalist = hashlist;
	while (not_root) {
		var current_level = [];
		for (var i = 0; i < datalist.length; i++) {	
			if (datalist[i+1]) {
				var hashnode = new hash_node(hash_two(datalist[i], datalist[i+1]), current_level.length, false, false);
				current_level.push(hashnode);
				i++;
			} else {
				var hashnode = new hash_node(hash_one(datalist[i]), i, true, false);
				current_level.push(hashnode);
			}
		}
		this.tree_list.push(current_level);
		if (current_level.length <= 1) {
			not_root = false;
		}
		datalist = this.tree_list[this.tree_list.length - 1];
	}
	this.tree_list[this.tree_list.length - 1][0].is_root = true;
	this.root = this.tree_list[this.tree_list.length - 1][0];
};

merkle.prototype.root = function() {
	if (this.tree_list) {
		return this.tree_list[this.tree_list.length - 1][0].hash;
	} else {
		return [];
	}
};

merkle.prototype.find = function(key) {
	var datalist = this.data_list;
	var treelist = this.tree_list;
	var found_data = false;
	for (var i = 0; i < datalist.length; i++) {
		if (key === datalist[i].key) {
			found_data = datalist[i];
		}
	}
	if (found_data) {
		var node = null;
		if (hash_one(found_data) === treelist[0][found_data.index].hash) {
			node = treelist[0][found_data.index]; 
		} else {
			return false;
		}
		for (var i = 0; i < treelist.length; i++) {
			if (node === this.root) {
				return true;
			}
			if (node.single) {
				if (hash_one(node) !== treelist[i + 1][get_parent(node.index)].hash) {
					return false;
				} else {
					node = treelist[i + 1][get_parent(node.index)];
				}
			} else {
				var sibling = null;
				var duo = null;
				if (node.index%2 == 0) {
					sibling = treelist[i][node.index + 1];
					duo = hash_two(node, sibling);
				} else {
					sibling = treelist[i][node.index - 1];
					duo = hash_two(sibling, node);
				}
				if (duo !== treelist[i + 1][get_parent(node.index)].hash) {
					return false;
				} else {
					node = treelist[i + 1][get_parent(node.index)];
				}
			}
		}
	}
	return false;
};

module.exports = merkle;

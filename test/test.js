require('debug').enable('linux-swap');
var swap = require('../');
var assert = require('assert');

// 测试使用
swap.setPROC(__dirname+'/proc/');

swap('1458', function(err, size) {
	assert.equal(size, 4*1024);
});
swap('1459', function(err, size) {
	assert.equal(size, 9*1024);
});

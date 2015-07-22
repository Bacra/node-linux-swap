var fs				= require('fs');
var debug			= require('debug')('linux-swap');
var procfs			= require('procfs-stats');
var parseFilesize	= require('filesize-parser');

var rdopt			= {encoding: 'utf8'};
var swapLinReg		= /Swap:[^\n]+/g;
var swapReg			= /(\d+) +(\w+)\s*$/;

function smaps(pid, callback) {
	fs.readFile(exports.PROC+'/'+pid+'/smaps', rdopt, function(err, data) {
		if (err) return callback(err);

		var arr = data.match(swapLinReg);
		if (!arr) return callback(null, 0);

		var size = 0;
		arr.forEach(function(item) {
			var sizeAttr = item.match(swapReg);
			if (sizeAttr && sizeAttr[1] != '0') {
				if (sizeAttr[2] == 'kB') {
					size += sizeAttr[1] * 1024;
				} else {
					size += parseSize(sizeAttr[1]+sizeAttr[2]);
				}
			}
		});

		callback(null, size);
	});
}

function parseSize(str) {
	if (str == '0 kB') return 0;

	try {
		return parseFilesize(str.toUpperCase());
	} catch(e) {
		debug('parse memory <swap:%s> err:%o', sizeStr, e);
	}

	return 0;
}

exports = module.exports = function(pid, callback) {
	procfs(pid).status(function(err, data) {
		if (err) return callback(err);
		if (data.VmSwap) {
			callback(null, parseSize(data.VmSwap));
		} else {
			smaps(pid, callback);
		}
	});
};

exports.smaps = smaps;
exports.parseSize = parseSize;
exports.PROC = '/proc/';
exports.setPROC = function(path) {
	exports.PROC = procfs.PROC = path;
}

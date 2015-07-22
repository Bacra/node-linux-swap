node-linux-swap  [![Build Status](https://travis-ci.org/Bacra/node-linux-swap.svg?branch=master)](https://travis-ci.org/Bacra/node-linux-swap)
==================

Get process swap usage in Linux.

## Install

```
npm i linux-swap --save
```

## Usage

```javascript
var swap = require('linux-swap')

swap(process.pid, function(err, size) {
	console.log(size);
});
```

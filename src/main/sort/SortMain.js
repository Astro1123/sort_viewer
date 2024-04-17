class SortMain {
	constructor(len, method) {
		this.struct = require('./Struct.js');
		this.make = require('./Make.js');
		this.objList = [];
		this.len = len;
		this.method = method;

		//this.logInit('debug');
	}
	
	logInit = function(level='info') {
		this.lwl = require('lwl');
		this.lwl.logFile = '-';
		this.lwl.logLevel = level;
	}
	
	pushObj = function(obj) {
		if (obj.state.process == 'inloop' || obj.state.process == 'loop end') {
			return;
		}
		this.objList.push(obj);
		/*
		if (obj.state.values[0] != null)
			console.log(obj.state.values[0]);
		*/
		
		//this.lwl.debug(this.objList);
	}

	run = function() {
		let arr = this.make.make(this.len);
		this.sortFunc(arr);
		//console.log(this.objList);
		return this.objList;
	}

	sortFunc = function(arr) {
		switch (this.method) {
			case "Heap Sort":
				let hSort = require('./sort/HeapSort');
				let sortClass = new hSort(this);
				sortClass.sorting(arr);
				break;
			default:
				break;
		}
	}
}

module.exports = SortMain;
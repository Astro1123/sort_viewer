class Util {
	static struct;
	
	constructor(comp = this.comp_asc) {
		this.struct = require('./Struct.js');
	}
	
	procObjBuilder = function(process, object, result, state) {
		let obj = {
			process: process,
			object: object,
			result: result,
			state: state,
		};
		return obj;
	};
	
	arrObjBuilder = function(arr, index, objName='') {
		let array = arr.concat();
		let obj = {
			type: 'array',
			value: arr[index],
			info: {
				array: array,
				index: index,
				objName: objName
			}
		};
		return obj;
	};
	
	valueObjBuilder = function(value, objName='') {
		let obj = {
			type: 'value',
			value: value,
			info: {
				objName: objName
			}
		};
		return obj;
	};

	stateObjBuilder = function(values, process) {
		let obj = {
			process: process,
			values: values
		};
		return obj;
	};
	
	commentObjBuilder = function(arr, tmp, bottom, parent, child, root, comment) {
		let obj = this.procObjBuilder(
			comment, null, null,
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], comment)
		);
		return obj;
	};
	
	compObjBuilder = function(arr, tmp, bottom, parent, child, root, left, right, op) {
		const process = this.struct.PROCESS_TYPE.compair;
		let obj = this.procObjBuilder(
			process,
			{
				left: left,
				right: right,
				op: op,
			},
			op.func(left.value, right.value),
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], process)
		);
		return obj;
	};
	
	changeObjBuilder = function(arr, tmp, bottom, parent, child, root, value, res) {
		const process = this.struct.PROCESS_TYPE.change;
		let obj = this.procObjBuilder(
			process,
			value,
			res,
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], process)
		);
		return obj;
	};
	
	setObjBuilder = function(arr, tmp, bottom, parent, child, root, value, res) {
		const process = this.struct.PROCESS_TYPE.set;
		let obj = this.procObjBuilder(
			process,
			value,
			res,
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], process)
		);
		return obj;
	};
	
	swapObjBuilder = function(arr, tmp, bottom, parent, child, root, left, right) {
		const process = this.struct.PROCESS_TYPE.swap;
		let obj = this.procObjBuilder(
			process,
			{
				left: left,
				right: right
			},
			{
				left: right,
				right: left
			},
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], process)
		);
		return obj;
	};
	
	loopObjBuilder = function(arr, tmp, bottom, parent, child, root, id, count=null, cnt_val=null) {
		const process = this.struct.PROCESS_TYPE.loop;
		let obj = this.procObjBuilder(
			process,
			{
				state: this.struct.STATE_TYPE.loop,
				count: count,
				cnt_val: cnt_val,
				id: id
			},
			null,
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], 'inloop')
		);
		return obj;
	};
	
	loopEndObjBuilder = function(arr, tmp, bottom, parent, child, root, id) {
		const process = this.struct.PROCESS_TYPE.loop;
		let obj = this.procObjBuilder(
			process,
			{
				state: this.struct.STATE_TYPE.end,
				count: null,
				cnt_val: null,
				id: id
			},
			null,
			this.stateObjBuilder([arr.concat(), tmp, bottom, parent, child, root], 'loop end')
		);
		return obj;
	};
	
	funcStartObjBuilder = function(arr, bottom, objName='') {
		let array = arr.concat();
		const process = this.struct.PROCESS_TYPE.func;
		let obj = this.procObjBuilder(
			process,
			{
				state: this.struct.STATE_TYPE.start,
				array: array,
				objName: objName
			},
			null,
			this.stateObjBuilder([arr.concat(), null, bottom, null], 'start')
		);
		return obj;
	};
	
	funcEndObjBuilder = function(arr, tmp, bottom, objName='') {
		const process = this.struct.PROCESS_TYPE.func;
		let array = arr.concat();
		let obj = this.procObjBuilder(
			process,
			{
				state: this.struct.STATE_TYPE.end,
				array: array,
				objName: objName
			},
			null,
			this.stateObjBuilder([arr.concat(), tmp, bottom, null], 'end')
		);
		return obj;
	};
}

module.exports = new Util();
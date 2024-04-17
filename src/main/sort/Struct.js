class Struct {
	static PROCESS_TYPE = {
		compair: "comp",
		swap: "swap",
		loop: "loop",
		change: "change",
		func: "func",
		set: "set"
	};
	
	static STATE_TYPE = {
		start: "start",
		loop: "loop",
		end: "end"
	};
	
	static OPERATOR = {
		gt: {
			func: (left, right) => {return left > right},
			string: '>'
		},
		ge: {
			func: (left, right) => {return left >= right},
			string: '>='
		},
		eq: {
			func: (left, right) => {return left == right},
			string: '=='
		},
		ne: {
			func: (left, right) => {return left != right},
			string: '!='
		},
		lt: {
			func: (left, right) => {return left < right},
			string: '<'
		},
		le: {
			func: (left, right) => {return left <= right},
			string: '<='
		}
	}
}

module.exports = Struct;
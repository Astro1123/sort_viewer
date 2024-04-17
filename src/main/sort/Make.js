class Make {
	make = function(len) {
		let arr = new Array(len);
		for (let i = 0; i < len; i++) {
			arr[i] = i + 1;
		}
		this.shuffle(arr);
		return arr;
	}
	
	printArr = function(arr) {
		process.stdout.write("[ ");
		for (let i = 0; i < arr.length - 1; i++) {
			process.stdout.write(arr[i]);
			process.stdout.write(", ");
		}
		process.stdout.write(arr[arr.length-1]);
		process.stdout.write("\n");
	}
	
	shuffle = function(arr) {
		for (let i = arr.length - 1; i >= 1; i--) {
			let j = this.rand(0, i);
			this.swap(arr, i, j);
		}
	}
	
	swap = function(arr, e1, e2) {
		let tmp = arr[e1];
		arr[e1] = arr[e2];
		arr[e2] = tmp;
	}
	
	rand = function(min, max) {
		let r = Math.random();
		if (min > max) {
			let tmp = max;
			max = min;
			min = tmp;
		}
		
		let result = Math.floor(r * (max + 1 - min) + min);
		return result;
	}
}

module.exports = new Make();
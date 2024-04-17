"use strict";

class HeapSort {
	comp;
	lwl;
	util;
	sm;
	static struct;
	
	constructor(sm, comp = "ASC") {
		this.setOrder(comp);
		this.utilInit();
		this.sm = sm;
		//this.smInit();
		//this.logInit('debug');
	}
	
	logInit = function(level='info') {
		this.lwl = require('lwl');
		this.lwl.logFile = '-';
		this.lwl.logLevel = level;
	}
	
	smInit = function() {
		this.sm = require('../SortMain.js');
	}
	
	utilInit = function() {
		this.util = require('../Util.js');
		
		this.struct = require('../Struct.js');
	}
	
	extHeap = function(arr, root, bottom) {
		this.sm.pushObj(
			this.util.setObjBuilder(
				arr,
				null,
				bottom,
				root,
				null,
				root,
				this.util.valueObjBuilder(null, 'root'),
				root
			)
		);
		this.sm.pushObj(
			this.util.setObjBuilder(
				arr,
				null,
				bottom,
				root,
				((2 * root) + 1),
				root,
				this.util.valueObjBuilder(null, 'child'),
				((2 * root) + 1)
			)
		);
		let child = (2 * root) + 1;
		
		this.sm.pushObj(
			this.util.setObjBuilder(
				arr,
				arr[root],
				bottom,
				root,
				child,
				root,
				this.util.valueObjBuilder(null, 'tmp'),
				arr[root]
			)
		);
		let tmp = arr[root];
		let p = root;
		
		while (true) {
			this.sm.pushObj(this.util.loopObjBuilder(arr, tmp, bottom, p, child, root, 3));
			
			let c1 = this.comp_op(
				arr, tmp, bottom, p, child, root,
				this.util.valueObjBuilder(child, 'child'),
				this.util.valueObjBuilder(bottom, 'bottom'),
				this.struct.OPERATOR.gt
			)
			this.sm.pushObj(c1);
			if (c1.result) {
				this.sm.pushObj(this.util.loopEndObjBuilder(arr, tmp, bottom, p, child, root, 3));
				break;
			}
			
			let c2 = this.comp_op(
				arr, tmp, bottom, p, child, root,
				this.util.valueObjBuilder(child, 'child'),
				this.util.valueObjBuilder(bottom, 'bottom'),
				this.struct.OPERATOR.lt
			);
			this.sm.pushObj(c2);
			if (c2.result) {
				let c3 = this.comp(
					arr, tmp, bottom, p, child, root,
					this.util.arrObjBuilder(arr, child + 1, 'arr'),
					this.util.arrObjBuilder(arr, child, 'arr')
				);
				this.sm.pushObj(c3);
				if (c3.result) {
					this.sm.pushObj(
						this.util.changeObjBuilder(
							arr, tmp, bottom, p, child, root,
							this.util.valueObjBuilder(child, 'child'),
							child + 1
						)
					);
					child = child + 1;
				}
			}
			
			let c4 = this.comp(
				arr, tmp, bottom, p, child, root,
				this.util.valueObjBuilder(tmp, 'tmp'),
				this.util.arrObjBuilder(arr, child, 'arr')
			)
			this.sm.pushObj(c4);
			if (c4.result) {
				this.sm.pushObj(this.util.loopEndObjBuilder(arr, tmp, bottom, p, child, root, 3));
				break;
			} else {
				this.sm.pushObj(
					this.util.changeObjBuilder(
						arr, tmp, bottom, p, child, root,
						this.util.arrObjBuilder(
							arr,
							(((child - 1) / 2) | 0),
							'arr'
						),
						arr[child]
					)
				);
				arr[((child - 1) / 2) | 0] = arr[child];
				this.sm.pushObj(
					this.util.changeObjBuilder(
						arr, tmp, bottom, p, child, root,
						this.util.valueObjBuilder(
							p,
							'parent'
						),
						child
					)
				);
				p = child;
				
				this.sm.pushObj(
					this.util.changeObjBuilder(
						arr, tmp, bottom, p, child, root,
						this.util.valueObjBuilder(
							child,
							'child'
						),
						((2 * child) + 1)
					)
				);
				child = (2 * child) + 1;
			}
		}
		
		this.sm.pushObj(
			this.util.changeObjBuilder(
				arr, tmp, bottom, p, child, root,
				this.util.arrObjBuilder(
					arr,
					(((child - 1) / 2) | 0),
					'arr'
				),
				tmp
			)
		);
		arr[((child - 1) / 2) | 0] = tmp;
		return true;
	}
	
	comp_op = function(arr, tmp, bottom, parent, child, root, left, right, op) {
		let obj = this.util.compObjBuilder(
			arr, tmp, bottom, parent, child, root, left, right, op
		);
		return obj;
	}
	
	comp_asc = function(arr, tmp, bottom, parent, child, root, left, right, op=null) {
		let obj = this.util.compObjBuilder(
			arr, tmp, bottom, parent, child, root, left, right, this.struct.OPERATOR.gt
		);
		return obj;
	}
	
	comp_desc = function(arr, tmp, bottom, parent, child, root, left, right, op=null) {
		let obj = this.util.compObjBuilder(
			arr, tmp, bottom, parent, child, root, left, right, this.struct.OPERATOR.lt
		);
		return obj;
	}
	
	setOrder = function(order) {
		if (order == "ASC") {
			this.comp = this.comp_asc;
		} else {
			this.comp = this.comp_desc;
		}
	}
	
	sorting = function(src) {
		let dst = src.concat();
		
		this.sm.pushObj(this.util.funcStartObjBuilder(dst, dst.length-1, 'dst'));
		
		for (let i = ((dst.length / 2) | 0) - 1; i >= 0; i--) {
			this.sm.pushObj(this.util.loopObjBuilder(dst, null, dst.length-1, null, null, null, 1, i, 'i'));
			
			this.extHeap(dst, i, dst.length - 1);
		}
		this.sm.pushObj(this.util.loopEndObjBuilder(dst, null, dst.length-1, null, null, null, 1));
		
		for (let i = dst.length - 1; i > 0; i--) {
			this.sm.pushObj(this.util.loopObjBuilder(dst, null, i, null, null, null, 2, i, 'i'));
			
			this.sm.pushObj(
				this.util.swapObjBuilder(
					dst, null, i, null, null, null,
					this.util.arrObjBuilder(dst, 0, 'dst'),
					this.util.arrObjBuilder(dst, i, 'dst'),
				)
			);
			let tmp = dst[0];
			dst[0] = dst[i];
			dst[i] = tmp;
			
			this.sm.pushObj(
				this.util.changeObjBuilder(
					dst, null, i-1, null, null, null,
					this.util.valueObjBuilder(
						i,
						'bottom'
					),
					i-1
				)
			);
			this.extHeap(dst, 0, i - 1);
		}
		this.sm.pushObj(this.util.loopEndObjBuilder(dst, null, -1, null, null, null, 2));
		
		this.sm.pushObj(this.util.funcEndObjBuilder(dst, null, -1, 'dst'));
		
		return dst;
	}
}

module.exports = HeapSort;
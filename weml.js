/*
	@license
	weml license:
		MIT License
		
		Copyright (c) 2017 Jan Katzer
		
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
		
		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.
		
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	
	# weml.js is based on code from JOML (https://github.com/JOML-CI/JOML)
	JOML license:
		The MIT License (MIT)
		
		Copyright (c) 2015-2017 JOML
		
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
		
		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.
		
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
*/

/**
 * @global
 * @namespace
 * @static
 * The main weml class. Contains some util functions.
 * @author Jan Katzer [@coffeenotfound]{@link https://github.com/coffeenotfound}
 */
var weml = {
	/**
	 * @private
	 */
	allocateArray: function(size) {
		return new Float32Array(size);
	},
	
	/**
	 * @private
	 */
	selectTypeprototype: function(clazz) {
		var hasSIMD = window.SIMD !== undefined;
		clazz.typeprototype._current = (hasSIMD ? clazz.typeprototype.simd : null) || clazz.typeprototype.sisd;
	},
	
	/**
	 * Does a 'proper' mod (<code>((x % n) + n) % n</code>) so that the result will always be greater than or equal to zero.
	 * @function
	 * @param {number} x
	 * @param {number} n
	 */
	modmod: function(x, n) {
		return ((x % n) + n) % n;
	},
	radmod: function(x) {
		return this.modmod(x + Math.PI, Math.PI*2) - Math.PI;
	},
	
	toRadians: function(x) {
		return x * (Math.PI / 180);
	},
	toDegrees: function(x) {
		return x * (180 / Math.PI);
	},
	
	rand: function(min, max) {
		min = min || 0;
		max = max || 1;
		return (Math.random() * (max - min)) + min;
	},
	randVec3: function(min, max, o) {
		o = o || new Vec3();
		min = min || -1.0;
		max = max || 1.0;
		o[0] = this.rand(min, max);
		o[1] = this.rand(min, max);
		o[2] = this.rand(min, max);
		return o;
	},
	randQuat: function(o) {
		o = o || new Quat();
		o[0] = this.rand(-1, 1);
		o[1] = this.rand(-1, 1);
		o[2] = this.rand(-1, 1);
		o[3] = this.rand(-1, 1);
		o.normalize();
		return o;
	},
};


// DEBUG: WEML TEST
$(function() {
	console.group("weml.js test");
	var a = new Vec3(1, 2, 3);
	var b = new Vec3(10, 10, 10);
	var c = new Vec3(-5, -5, -5);
	
	console.log("a =", a);
	console.log("b =", b);
	console.log("c =", c);
	
	console.log("");
	console.log("a.put(b).mul(c).mulScalar(2).get(c).addXYZ(1,1,1) =", a.put(b).mul(c).mulScalar(2).get(c).addXYZ(1,1,1));
	console.log("");
	
	console.log("a =", a);
	console.log("b =", b);
	console.log("c =", c);
	console.groupEnd();
});


/**
 * Constructs a new {@link Vec3} with the given values.
 * @class
 * @param {Number} [x=0] - The initial x component of the vector
 * @param {Number} [y=0] - The initial y component of the vector
 * @param {Number} [z=0] - The initial z component of the vector
 * @returns {Vec3}
 */
var Vec3 = function(x, y, z) {
	var vec = weml.allocateArray(3);
	Object.assign(vec, Vec3.typeprototype._current);
	vec[0] = x || 0;
	vec[1] = y || 0;
	vec[2] = z || 0;
	return vec;
};

Vec3.typeprototype = {};
(function() {
// ## sisd implementation ##
	Vec3.typeprototype.sisd = {
		toString: function() {
			return "Vec3[" + this[0] + ", " + this[1] + ", " + this[2] +"]";
		},
		
		/**
		 * Returns the number of components of this vector. A {@link Vec3} will always return <code>3</code>.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number}
		 */
		size: function() {
			return 3;
		},
		
		/**
		 * Returns a new Vec3 with the same values as this.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Vec3}
		 */
		clone: function() {
			return new Vec3(this[0], this[1], this[2]);
		},
		
		/**
		 * Sets this to identity <code>(0, 0, 0)</code> and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Vec3} itself
		 */
		identity: function() {
			this.setXYZ(0, 0, 0);
			return this;
		},
		
		/**
		 * Sets this vector to <code>(0, 0, 0)</code> and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Vec3} itself
		 */
		zero: function() {
			this.setXYZ(0, 0, 0);
			return this;
		},
		
		/**
		 * Sets this vector to be equal with the given {@link Vec3} and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Vec3} itself
		 */
		set: function(a) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			return this;
		},
		
		/**
		 * Sets this vector to a swizzled form of the given {@link Vec3} and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Number} swizzlex
		 * @param {Number} swizzley
		 * @param {Number} swizzlez
		 * @returns {Vec3} itself
		 */
		setSwizzle: function(a, swizzlex, swizzley, swizzlez) {
			var nx = a[swizzlex];
			var ny = a[swizzley];
			var nz = a[swizzlez];
			this[0] = nx;
			this[1] = ny;
			this[2] = nz;
			return this;
		},
		
		/**
		 * Sets this vector to the given values and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Vec3} itself
		 */
		setXYZ: function(x, y, z) {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			return this;
		},
		
		/**
		 * Sets this vector's x component and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @returns {Vec3} itself
		 */
		setX: function(x) {
			this[0] = x;
			return this;
		},
		
		/**
		 * Sets this vector's y component and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} y
		 * @returns {Vec3} itself
		 */
		setY: function(y) {
			this[1] = y;
			return this;
		},
		
		/**
		 * Sets this vector's z component and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} z
		 * @returns {Vec3} itself
		 */
		setZ: function(z) {
			this[2] = z;
			return this;
		},
		
		/**
		 * Sets all of this vector's components to the given scalar and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} s
		 * @returns {Vec3} itself
		 */
		setScalar: function(s) {
			this.setXYZ(s, s, s);
			return this;
		},
		
		/**
		 * Sets the given vector equal to this vector and returns the given vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} o
		 * @returns {Vec3} the given vector <code>o</code>
		 */
		get: function(o) {
			o[0] = this[0];
			o[1] = this[1];
			o[2] = this[2];
			return o;
		},
		
		/**
		 * Returns this vector's x component.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} this vector's x component
		 */
		getX: function() {
			return this[0];
		},
		
		/**
		 * Returns this vector's x component.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} this vector's y component
		 */
		getY: function() {
			return this[1];
		},
		
		/**
		 * Returns this vector's x component.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} this vector's z component
		 */
		getZ: function() {
			return this[2];
		},
		
		/**
		 * Puts this vector into the given vector or typed array and returns itself.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Number} [offset]
		 * @returns {Vec3} itself
		 */
		put: function(a, offset) {
			offset = offset || 0;
			a[0 + offset] = this[0];
			a[1 + offset] = this[1];
			a[2 + offset] = this[2];
			return this;
		},
		
		
		/**
		 * Adds the given vector and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		add: function(a, o) {
			o = o || this;
			o[0] = this[0] + a[0];
			o[1] = this[1] + a[1];
			o[2] = this[2] + a[2];
			return o;
		},
		
		/**
		 * Adds the given x, y and z values and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		addXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] + x;
			o[1] = this[1] + y;
			o[2] = this[2] + z;
			return o;
		},
		
		/**
		 * Adds the given scalar to each component of this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		addScalar: function(s, o) {
			o = o || this;
			this.addXYZ(s, s, s, o);
			return o;
		},
		
		
		/**
		 * Subtracts the given vector from this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		sub: function(a, o) {
			o = o || this;
			o[0] = this[0] - a[0];
			o[1] = this[1] - a[1];
			o[2] = this[2] - a[2];
			return o;
		},
		
		/**
		 * Subtracts the given values from this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		subXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] - x;
			o[1] = this[1] - y;
			o[2] = this[2] - z;
			return o;
		},
		
		/**
		 * Subtracts the given scalar from each component of this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		subScalar: function(s, o) {
			o = o || this;
			this.subXYZ(s, s, s, o);
			return o;
		},
		
		
		/**
		 * Multiplies the given vector and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		mul: function(a, o) {
			o = o || this;
			o[0] = this[0] * a[0];
			o[1] = this[1] * a[1];
			o[2] = this[2] * a[2];
			return o;
		},
		
		/**
		 * Multiplies the given values and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		mulXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] * x;
			o[1] = this[1] * y;
			o[2] = this[2] * z;
			return o;
		},
		
		/**
		 * Multiplies this vector by the given scalar and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		mulScalar: function(s, o) {
			o = o || this;
			this.mulXYZ(s, s, s, o);
			return o;
		},
		
		
		/**
		 * Divides this vector by the given vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		div: function(a, o) {
			o = o || this;
			o[0] = this[0] / a[0];
			o[1] = this[1] / a[1];
			o[2] = this[2] / a[2];
			return o;
		},
		
		/**
		 * Divides this vector by the given values and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		divXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] / x;
			o[1] = this[1] / y;
			o[2] = this[2] / z;
			return o;
		},
		
		/**
		 * Divides this vector by the given scalar and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		divScalar: function(s, o) {
			o = o || this;
			this.divXYZ(s, s, s, o);
			return o;
		},
		
		muladd: function(a, b, o) {
			o = o || this;
			this.mul(a, o).add(b);
			return o;
		},
		muladdXYZ: function(ax, ay, az, bx, by, bz, o) {
			o = o || this;
			this.mulXYZ(ax, ay, az, o).add(bx, by, bz);
			return o;
		},
		
		
		/**
		 * Calculates the dot product of this vector and the given vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Number} the result
		 */
		dot: function(a) {
			return this[0]*a[0] + this[1]*a[1] + this[2]*a[2];
		},
		
		/**
		 * Calculates the dot product of this vector and the given vector components and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Number} the result
		 */
		dotXYZ: function(x, y, z) {
			return this[0]*x + this[1]*y + this[2]*z;
		},
		
		
		/**
		 * Normalizes this vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		normalize: function(o) {
			o = o || this;
			var invlength = this.invmagnitude();
			if(!Number.isNaN(invlength)) {
				o[0] = this[0] * invlength;
				o[1] = this[1] * invlength;
				o[2] = this[2] * invlength;
			}
			return o;
		},
		
		
		/**
		 * Calculates the cross product of this vector and the given vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		cross: function(a, o) {
			o = o || this;
			var nx = this[1] * a[2] - this[2] * a[1];
			var ny = this[2] * a[0] - this[0] * a[2];
			var nz = this[0] * a[1] - this[1] * a[0];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			return o;
		},
		
		/**
		 * Calculates the cross product of this vector and the given vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} x
		 * @param {Vec3} y
		 * @param {Vec3} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		crossXYZ: function(x, y, z, o) {
			o = o || this;
			var nx = this[1] * z - this[2] * y;
			var ny = this[2] * x - this[0] * z;
			var nz = this[0] * y - this[1] * x;
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			return o;
		},
		
		
		/**
		 * Calculates the magnitude (length) of this vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} the result
		 */
		magnitude: function() {
			return Math.sqrt(this[0]*this[0] + this[1]*this[1] + this[2]*this[2]);
		},
		
		/**
		 * Calculates the squared magnitude (length) of this vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} the result
		 */
		magnitudesq: function() {
			return this[0]*this[0] + this[1]*this[1] + this[2]*this[2];
		},
		
		/**
		 * Calculates the inverted magnitude (length) of this vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} the result
		 */
		invmagnitude: function() {
			return 1.0 / this.magnitude();
		},
		
		/**
		 * Calculates the inverted square-magnitude (length) of this vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @returns {Number} the result
		 */
		invmagnitudesq: function() {
			return 1.0 / this.magnitudesq();
		},
		
		
		/**
		 * Calculates the distance between this vector and the given vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Number} the result
		 */
		dist: function(a) {
			return Math.sqrt(this.distsq(a));
		},
		
		/**
		 * Calculates the distance between this vector and the given vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Number} the result
		 */
		distXYZ: function(x, y, z) {
			return Math.sqrt(this.distsqXYZ(x, y, z));
		},
		
		/**
		 * Calculates the squared distance between this vector and the given vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Number} the result
		 */
		distsq: function(a) {
			var dx = this[0] - a[0];
			var dy = this[1] - a[1];
			var dz = this[2] - a[2];
			return dx*dx + dy*dy + dz*dz;
		},
		
		/**
		 * Calculates the squared distance between this vector and the given vector and returns it.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Number} the result
		 */
		distsqXYZ: function(x, y, z) {
			var dx = this[0] - x;
			var dy = this[1] - y;
			var dz = this[2] - z;
			return dx*dx + dy*dy + dz*dz;
		},
		
		
		/**
		 * Negates this vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		negate: function(o) {
			o = o || this;
			o[0] = -this[0];
			o[1] = -this[1];
			o[2] = -this[2];
			return o;
		},
		
		
		/**
		 * Reflects this vector around the given normal vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} normal
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		reflect: function(normal, o) {
			o = o || this;
			var dot = this.dot(normal);
			o[0] = this[0] - (dot + dot) * normal[0];
			o[1] = this[1] - (dot + dot) * normal[1];
			o[2] = this[2] - (dot + dot) * normal[2];
			return o;
		},
		
		/**
		 * Reflects this vector around the given normal vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} normalx
		 * @param {Number} normaly
		 * @param {Number} normalz
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		reflectXYZ: function(x, y, z, o) {
			o = o || this;
			var dot = this.dotXYZ(x, y, z);
			o[0] = this[0] - (dot + dot) * x;
			o[1] = this[1] - (dot + dot) * y;
			o[2] = this[2] - (dot + dot) * z;
			return o;
		},
		
		
		/**
		 * Calculates the half vector of this vector and the given vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		half: function(a, o) {
			o = o || this;
			o.add(a).normalize();
			return o;
		},
		
		/**
		 * Calculates the half vector of this vector and the given vector and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		halfXYZ: function(x, y, z, o) {
			o = o || this;
			o.addXYZ(x, y, z).normalize();
			return o;
		},
		
		/**
		 * not working
		 * @memberOf Vec3
		 * @instance
		 * @function
		 */
		clampLength: function(min, max, o) {
			o = o || this;
			var lensq = this.magnitudesq();
			if(lensq < min*min) {
				var invlen = 1.0 / Math.sqrt(lensq);
				o[0] = (this[0] * invlen) * min;
				o[1] = (this[1] * invlen) * min;
				o[2] = (this[2] * invlen) * min;
			}
			else if(lensq > max*max) {
				var invlenn = 1.0 / Math.sqrt(lensq);
				o[0] = (this[0] * invlenn) * max;
				o[1] = (this[1] * invlenn) * max;
				o[2] = (this[2] * invlenn) * max;
			}
			return o;
		},
		
		
		/**
		 * Linearly inerpolates this vector to the given vector by the given alpha and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Number} t
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		lerp: function(a, t, o) {
			o = o || this;
			o[0] = this[0] + (a[0] - this[0]) * t;
			o[1] = this[1] + (a[1] - this[1]) * t;
			o[2] = this[2] + (a[2] - this[2]) * t;
			return o;
		},
    
		/**
		 * Linearly inerpolates this vector to the given vector by the given alpha and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec3
		 * @instance
		 * @function
		 * @param {Vec3} x
		 * @param {Vec3} y
		 * @param {Vec3} z
		 * @param {Number} t
		 * @param {Vec3} [target=this]
		 * @returns {Vec3} the target
		 */
		lerpXYZ: function(x, y, z, t, o) {
			o = o || this;
			o[0] = this[0] + (x - this[0]) * t;
			o[1] = this[1] + (y - this[1]) * t;
			o[2] = this[2] + (z - this[2]) * t;
			return o;
		},
	};
	
// ## simd implementation ##
	Vec3.typeprototype.simd = Object.assign(Object.create(Vec3.typeprototype.sisd), { // copy sisd prototype to ensure full api
		mul: function(a, o) {
			o = o || this;
			SIMD.Float32x4.mul(SIMD.Float32x4.load3(this), SIMD.Float32x4.load3(a)).store3(o);
			return o;
		},
		mulXYZ: function(x, y, z, o) {
			o = o || this;
			SIMD.Float32x4.mul(SIMD.Float32x4.load3(this), SIMD.Float32x4(x, y, z)).store3(o);
			return o;
		},
		mulScalar: function(s, o) {
			o = o || this;
			SIMD.Float32x4.mul(SIMD.Float32x4.load3(this), SIMD.Float32x4.splat(3)).store3(o);
			return o;
		},
		
		muladd: function(a, b, o) {
			o = o || this;
			SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.load3(this), SIMD.Float32x4.load3(a)), SIMD.Float32x4.load3(b)).store3(o);
			return o;
		},
		muladdXYZ: function(ax, ay, az, bx, by, bz, o) {
			o = o || this;
			SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.load3(this), SIMD.Float32x4(ax, ay, az)), SIMD.Float32x4(bx, by, bz)).store3(o);
			return o;
		},
	});
	
	// select typeprototype
	weml.selectTypeprototype(Vec3);
})();
 

/**
 * Constructs a new {@link Vec4} with the given values. The components of the vector are
 * ordered as <code>(x, y, z, w)</code>. The given values default to the identity of a Vec4 which is
 * <code>(0, 0, 0, 1)</code>.
 * @class
 * @param {Number} [x=0] - The initial x component of the vector
 * @param {Number} [y=0] - The initial y component of the vector
 * @param {Number} [z=0] - The initial z component of the vector
 * @param {Number} [w=1] - The initial w component of the vector
 * @returns {Vec4}
 */
var Vec4 = function(x, y, z, w) {
	var vec = weml.allocateArray(4);
	Object.assign(vec, Vec4.typeprototype._current);
	vec[0] = x || 0;
	vec[1] = y || 0;
	vec[2] = z || 0;
	vec[3] = w || 1;
	return vec;
};

Vec4.typeprototype = {};
(function() {
// ## sisd implementation ##
	Vec4.typeprototype.sisd = {
		toString: function() {
			return "Vec4[" + this[0] + ", " + this[1] + ", " + this[2] + ", " + this[3] + "]";
		},
		
		/**
		 * Returns a new {@link Vec4} that is a clone of this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Vec4}
		 */
		clone: function() {
			return new Vec4(this[0], this[1], this[2], this[3]);
		},
		
		/**
		 * Sets this vector to identity <code>(0, 0, 0, 1)</code> and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Vec4}
		 */
		identity: function() {
			return this.set(0, 0, 0, 1);
		},
		
		/**
		 * Zeroes this vector and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Vec4}
		 */
		zero: function() {
			return this.set(0, 0, 0, 0);
		},
		
		
		/**
		 * Sets this vector to be equal to the given vector and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @returns {Vec4} itself
		 */
		set: function(a) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			this[3] = a[3];
			return this;
		},
		
		/**
		 * Sets this vector to the given values and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @returns {Vec4} itself
		 */
		setXYZW: function(x, y, z, w) {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			this[3] = w;
			return this;
		},
		
		/**
		 * Sets this vector's x component and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @returns {Vec4} itself
		 */
		setX: function(x) {
			this[0] = x;
			return this;
		},
		
		/**
		 * Sets this vector's y component and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} y
		 * @returns {Vec4} itself
		 */
		setY: function(y) {
			this[1] = y;
			return this;
		},
		
		/**
		 * Sets this vector's z component and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} z
		 * @returns {Vec4} itself
		 */
		setZ: function(z) {
			this[2] = z;
			return this;
		},
		
		/**
		 * Sets this vector's w component and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} w
		 * @returns {Vec4} itself
		 */
		setW: function(w) {
			this[3] = w;
			return this;
		},
		setScalar: function(s) {
			this[0] = s;
			this[1] = s;
			this[2] = s;
			this[3] = s;
			return this;
		},
		
		
		/**
		 * Puts this vector into the given vector or typed array and returns itself.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @param {Number} [offset]
		 * @returns {Vec4} itself
		 */
		put: function(a) {
			a[0] = this[0];
			a[1] = this[1];
			a[2] = this[2];
			a[3] = this[3];
			return this;
		},
		
		/**
		 * Sets the given vector equal to this vector and returns the given vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} o
		 * @returns {Vec4} the given vector <code>o</code>
		 */
		get: function(o) {
			o[0] = this[0];
			o[1] = this[1];
			o[2] = this[2];
			o[3] = this[3];
			return o;
		},
		
		/**
		 * Returns this vector's x component.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Number} this vector's x component
		 */
		getX: function() {
			return this[0];
		},
		
		/**
		 * Returns this vector's y component.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Number} this vector's y component
		 */
		getY: function() {
			return this[1];
		},
		
		/**
		 * Returns this vector's z component.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Number} this vector's z component
		 */
		getZ: function() {
			return this[2];
		},
		
		/**
		 * Returns this vector's w component.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @returns {Number} this vector's w component
		 */
		getW: function() {
			return this[3];
		},
		
		
		/**
		 * Adds the given vector and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		add: function(a, o) {
			o = o || this;
			o[0] = this[0] + a[0];
			o[1] = this[1] + a[1];
			o[2] = this[2] + a[2];
			o[3] = this[3] + a[3];
			return o;
		},
		
		/**
		 * Adds the given x, y, z and w values and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		addXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] + x;
			o[1] = this[1] + y;
			o[2] = this[2] + z;
			o[3] = this[3] + w;
			return o;
		},
		
		/**
		 * Adds the given scalar to each component of this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		addScalar: function(s, o) {
			o = o || this;
			this.addXYZW(s, s, s, s, o);
			return o;
		},
		
		
		/**
		 * Subtracts the given vector from this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		sub: function(a, o) {
			o = o || this;
			o[0] = this[0] - a[0];
			o[1] = this[1] - a[1];
			o[2] = this[2] - a[2];
			o[3] = this[3] - a[3];
			return o;
		},
		
		/**
		 * Subtracts the given values from this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		subXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] - x;
			o[1] = this[1] - y;
			o[2] = this[2] - z;
			o[3] = this[3] - w;
			return o;
		},
		
		/**
		 * Subtracts the given scalar from each component of this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		subScalar: function(s, o) {
			o = o || this;
			this.subXYZW(s, s, s, s, o);
			return o;
		},
		
		
		/**
		 * Multiplies the given vector and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		mul: function(a, o) {
			o = o || this;
			o[0] = this[0] * a[0];
			o[1] = this[1] * a[1];
			o[2] = this[2] * a[2];
			o[3] = this[3] * a[3];
			return o;
		},
		
		/**
		 * Multiplies the given values and this vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		mulXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] * x;
			o[1] = this[1] * y;
			o[2] = this[2] * z;
			o[3] = this[3] * w;
			return o;
		},
		
		/**
		 * Multiplies this vector by the given scalar and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		mulScalar: function(s, o) {
			o = o || this;
			mulXYZW(s, s, s, s, o);
			return o;
		},
		
		
		/**
		 * Divides this vector by the given vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Vec4} a
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		div: function(a, o) {
			o = o || this;
			o[0] = this[0] / a[0];
			o[1] = this[1] / a[1];
			o[2] = this[2] / a[2];
			o[3] = this[3] / a[3];
			return o;
		},
		
		/**
		 * Divides this vector by the given vector and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		divXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] / x;
			o[1] = this[1] / y;
			o[2] = this[2] / z;
			o[3] = this[3] / w;
			return o;
		},
		
		/**
		 * Divides this vector by the given scalar and writes the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Vec4
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Vec4} [target=this]
		 * @returns {Vec4} the target
		 */
		divScalar: function(s, o) {
			o = o || this;
			this.divXYZW(s, s, s, s, o);
			return o;
		},
	};
	
	// select typeprototype
	weml.selectTypeprototype(Vec4);
})();


/**
 * Constructs a new {@link Quat} with the given values. The components of the quaternion are
 * ordered as <code>(x, y, z, w)</code>. The given values default to the identity of a {@link Quat} which is
 * <code>(0, 0, 0, 1)</code>.
 * @class
 * @param {Number} [x=0] - The initial x component of the vector
 * @param {Number} [y=0] - The initial y component of the vector
 * @param {Number} [z=0] - The initial z component of the vector
 * @param {Number} [w=1] - The initial w component of the vector
 * @returns {Quat}
 */
var Quat = function(x, y, z, w) {
	var quat = weml.allocateArray(4);
	Object.assign(quat, Quat.typeprototype._current);
	quat[0] = x || 0;
	quat[1] = y || 0;
	quat[2] = z || 0;
	quat[3] = w || 1;
	return quat;
};

Quat.typeprototype = {};
(function() {
// ## sisd implementation ##
	Quat.typeprototype.sisd = {
		
		/**
		 * Returns a new {@link Quat} that is a clone of this quaternion.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @returns {Quat}
		 */
		clone: function() {
			var quat = new Quat();
			quat.set(this);
			return quat;
		},
		
		
		/**
		 * Sets this quaternion to be equal to the given quaternion and returns itself.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @returns {Quat} itself
		 */
		set: function(a) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			this[3] = a[3];
			return this;
		},
		
		/**
		 * Sets this quaternion to the given values and returns itself.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Number} w
		 * @returns {Quat} itself
		 */
		setXYZW: function(x, y, z, w) {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			this[3] = w;
			return this;
		},
		
		
		/**
		 * Sets this quaternion to identity <code>(0, 0, 0, 1)</code> and returns itself.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @returns {Quat} itself
		 */
		identity: function() {
			this[0] = 0;
			this[1] = 0;
			this[2] = 0;
			this[3] = 1;
			return this;
		},
		
		/**
		 * Zeroes this quaternion to <code>(0, 0, 0, 0)</code> and returns itself.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @returns {Quat} itself
		 */
		zero: function() {
			this[0] = 0;
			this[1] = 0;
			this[2] = 0;
			this[3] = 0;
			return this;
		},
		
		/**
		 * (Post-)multiplies the given quaternion with this quaternion and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		mul: function(a, o) {
			o = o || this;
			// post-multiply
			var nx = this[3] * a[0] + this[0] * a[3] + this[1] * a[2] - this[2] * a[1];
			var ny = this[3] * a[1] - this[0] * a[2] + this[1] * a[3] + this[2] * a[0];
			var nz = this[3] * a[2] + this[0] * a[1] - this[1] * a[0] + this[2] * a[3];
			var nw = this[3] * a[3] - this[0] * a[0] - this[1] * a[1] - this[2] * a[2];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		/**
		 * (Post-)multiplies the given quaternion with this quaternion and stores the result into the target vector and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} x
		 * @param {Quat} y
		 * @param {Quat} z
		 * @param {Quat} w
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		mulXYZW: function(x, y, z, w, o) {
			o = o || this;
			// post-multiply
			var nx = this[3] * x + this[0] * w + this[1] * z - this[2] * a[1];
			var ny = this[3] * y - this[0] * z + this[1] * w + this[2] * a[0];
			var nz = this[3] * z + this[0] * y - this[1] * x + this[2] * a[3];
			var nw = this[3] * w - this[0] * x - this[1] * y - this[2] * a[2];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		/**
		 * (Post-)multiplies the given quaternion with this quaternion and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} x
		 * @param {Quat} y
		 * @param {Quat} z
		 * @param {Quat} w
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		mulScalar: function(s, o) {
			o = o || this;
			// post-multiply
			var nx = this[3] * s + this[0] * s + this[1] * s - this[2] * a[1];
			var ny = this[3] * s - this[0] * s + this[1] * s + this[2] * a[0];
			var nz = this[3] * s + this[0] * s - this[1] * s + this[2] * a[3];
			var nw = this[3] * s - this[0] * s - this[1] * s - this[2] * a[2];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		
		/**
		 * Normalizes this quaternion and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		normalize: function(o) {
			o = o || this;
			var invMag = 1.0 / Math.sqrt(this[0]*this[0] + this[1]*this[1] + this[2]*this[2] + this[3]*this[3]);
			o[0] = this[0] * invMag;
			o[1] = this[1] * invMag;
			o[2] = this[2] * invMag;
			o[3] = this[3] * invMag;
			return o;
		},
		
		
		/**
		 * Inverts this quaternion and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		invert: function(o) {
			o = o || this;
			var invNorm = 1.0 / this.norm();
			o[0] = -this[0] * invNorm;
			o[1] = -this[1] * invNorm;
			o[2] = -this[2] * invNorm;
			o[3] = this[3] * invNorm;
			return o;
		},
		
		/**
		 * Calculates the conjugate of this quaternion and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		conjugate: function(o) {
			o = o || this;
			o[0] = -this[0];
			o[1] = -this[1];
			o[2] = -this[2];
			o[3] = this[3];
			return o;
		},
		
		
		/**
		 * Calculates the norm of this quaternion and returns it.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @returns {Number} the result
		 */
		norm: function() {
			return (this[0]*this[0] + this[1]*this[1] + this[2]*this[2] + this[3]*this[3]);
		},
		
		
		/**
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Number} radx
		 * @param {Number} rady
		 * @param {Number} radz
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		rotateXYZ: function(radx, rady, radz, o) {
			o = o || this;
			var sx = Math.sin(radx * 0.5);
			var cx = Math.cos(radx * 0.5);
			var sy = Math.sin(rady * 0.5);
			var cy = Math.cos(rady * 0.5);
			var sz = Math.sin(radz * 0.5);
			var cz = Math.cos(radz * 0.5);
			
			var cycz = cy * cz;
			var sysz = sy * sz;
			var sycz = sy * cz;
			var cysz = cy * sz;
			var w = cx * cycz - sx * sysz;
			var x = sx * cycz + cx * sysz;
			var y = cx * sycz - sx * cysz;
			var z = cx * cysz + sx * sycz;
			
			// right-multiply
			var nx = this[3] * x + this[0] * w + this[1] * z - this[2] * y;
			var ny = this[3] * y - this[0] * z + this[1] * w + this[2] * x;
			var nz = this[3] * z + this[0] * y - this[1] * x + this[2] * w;
			var nw = this[3] * w - this[0] * x - this[1] * y - this[2] * z;
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		
		/**
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Number} radx
		 * @param {Number} rady
		 * @param {Number} radz
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		rotateLocalXYZ: function(radx, rady, radz, o) {
			o = o || this;
			var thetaX = radx * 0.5;
			var thetaY = rady * 0.5;
			var thetaZ = radz * 0.5;
			var thetaMagSq = thetaX * thetaX + thetaY * thetaY + thetaZ * thetaZ;
			var s;
			var dqX, dqY, dqZ, dqW;
			
			if(thetaMagSq * thetaMagSq / 24.0 < 1E-8) {
				dqW = 1.0 - thetaMagSq * 0.5;
				s = 1.0 - thetaMagSq / 6.0;
			}
			else {
				var thetaMag = Math.sqrt(thetaMagSq);
				var sin = Math.sin(thetaMag);
				s = sin / thetaMag;
				//dqW = Math.cosFromSin(sin, thetaMag);
				dqW = Math.cos(thetaMag);
			}
			dqX = thetaX * s;
			dqY = thetaY * s;
			dqZ = thetaZ * s;
			
			/* Pre-multiplication */
			o[0] = dqW * this[0] + dqX * this[3] + dqY * this[2] - dqZ * this[1];
			o[1] = dqW * this[1] - dqX * this[2] + dqY * this[3] + dqZ * this[0];
			o[2] = dqW * this[2] + dqX * this[1] - dqY * this[0] + dqZ * this[3];
			o[3] = dqW * this[3] - dqX * this[0] - dqY * this[1] - dqZ * this[2];
			return o;
		},
		
		/**
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Number} axisx
		 * @param {Number} axisy
		 * @param {Number} axisz
		 * @param {Number} angle
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		rotateAroundAxisXYZ: function(axisx, axisy, axisz, angle, o) {
			o = o || this;
			var hangle = angle * 0.5;
			var sinAngle = Math.sin(hangle);
			var invVLength = 1.0 / Math.sqrt(axisx * axisx + axisy * axisy + axisz * axisz);
			
			var rx = axisx * invVLength * sinAngle;
			var ry = axisy * invVLength * sinAngle;
			var rz = axisz * invVLength * sinAngle;
			var rw = Math.cos(hangle);
			
			var nx = this[3] * rx + this[0] * rw + this[1] * rz - this[2] * ry;
			var ny = this[3] * ry - this[0] * rz + this[1] * rw + this[2] * rx;
			var nz = this[3] * rz + this[0] * ry - this[1] * rx + this[2] * rw;
			var nw = this[3] * rw - this[0] * rx - this[1] * ry - this[2] * rz;
			this[0] = nx;
			this[1] = ny;
			this[2] = nz;
			this[3] = nw;
			return o;
		},
		
		/** TODO: */
		rotateAroundLocalAxisXYZ: function(axisx, axisy, axisz, angle, o) {
			
		},
		
		/**
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Vec3} eye
		 * @param {Vec3} center
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		rotateTo: function(eye, center, o) {
			o = o || this;
			var x = eye[1] * center[2] - eye[2] * center[1];
			var y = eye[2] * center[0] - eye[0] * center[2];
			var z = eye[0] * center[1] - eye[1] * center[0];
			var w = Math.sqrt((eye[0]*eye[0] + eye[1]*eye[1] + eye[2]*eye[2]) *
							(center[0]*center[0] + center[1]*center[1] + center[2]*center[2])) +
							(eye[0] * center[0] + eye[1] * center[1] + eye[2] * center[2]);
			//var invNorm = 1.0 / Math.sqrt(this[0]*this[0] + this[1]*this[1] + this[2]*this[2] + this[3]*this[3]);
			var invNorm = 1.0 / Math.sqrt(x*x + y*y + z*z + w*w);
			
			// skip for now and pray nothing shits the bed
			/*
			if (Float.isInfinite(invNorm)) {
				// Rotation is ambiguous: Find appropriate rotation axis (1. try center. x +Z)
				x = center.Y; y = -center.X; z = 0.0f; w = 0.0f;
				invNorm = (float) (1.0 / Math.sqrt(x * x + y * y));
				if (Float.isInfinite(invNorm)) {
					// 2. try center. x +X
					x = 0.0f; y = center.Z; z = -center.Y; w = 0.0f;
					invNorm = (float) (1.0 / Math.sqrt(y * y + z * z));
				}
			}
			*/
			
			x *= invNorm;
			y *= invNorm;
			z *= invNorm;
			w *= invNorm;
			
			/* Multiply */
			o[0] = this[3] * x + this[0] * w + this[1] * z - this[2] * y;
			o[1] = this[3] * y - this[0] * z + this[1] * w + this[2] * x;
			o[2] = this[3] * z + this[0] * y - this[1] * x + this[2] * w;
			o[3] = this[3] * w - this[0] * x - this[1] * y - this[2] * z;
			return o;
		},
		
		/*
		lookAt: function(eye, center, up) {
			o = o || this;
		},
		*/
		
		/**
		 * Calculates the difference between this quaternion and the given quaternion and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		diff: function(a, o) {
			o = o || this;
			var invNorm = 1.0 / this.norm();
			var x = -this[0] * invNorm;
			var y = -this[1] * invNorm;
			var z = -this[2] * invNorm;
			var w = this[3] * invNorm;
			
			var nx = w * a[0] + x * a[3] + y * a[2] - z * a[1];
			var ny = w * a[1] - x * a[2] + y * a[3] + z * a[0];
			var nz = w * a[2] + x * a[1] - y * a[0] + z * a[3];
			var nw = w * a[3] - x * a[0] - y * a[1] - z * a[2];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		/**
		 * Does a spherical interpolation of this quaterion to the given quaternion over the given alpha value and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @param {Number} alpha
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		slerp: function(a, alpha, o) {
			o = o || this;
			var cosom = this[0] * a[0] + this[1] * a[1] + this[2] * a[2] + this[3] * a[3];
			var absCosom = Math.abs(cosom);
			var scale0, scale1;
			if (1.0 - absCosom > 1.0E-6) {
				var sinSqr = 1.0 - absCosom * absCosom;
				var sinom = 1.0 / Math.sqrt(sinSqr);
				var omega = Math.atan2(sinSqr * sinom, absCosom);
				scale0 = Math.sin((1.0 - alpha) * omega) * sinom;
				scale1 = Math.sin(alpha * omega) * sinom;
			}
			else {
				scale0 = 1.0 - alpha;
				scale1 = alpha;
			}
			
			scale1 = cosom >= 0.0 ? scale1 : -scale1;
			var nx = scale0 * this[0] + scale1 * a[0];
			var ny = scale0 * this[1] + scale1 * a[1];
			var nz = scale0 * this[2] + scale1 * a[2];
			var nw = scale0 * this[3] + scale1 * a[3];
			o[0] = nx;
			o[1] = ny;
			o[2] = nz;
			o[3] = nw;
			return o;
		},
		
		/**
		 * <b>Not implemented</b>
		 * Does a linear interpolation of this quaterion to the given quaternion over the given alpha value and stores the result into the target quaternion and then returns the target.
		 * The target vector defaults to this vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @param {Number} alpha
		 * @param {Quat} [target=this]
		 * @returns {Quat} the target
		 */
		lerp: function(a, alpha, o) {
			
		},
		
		
		/**
		 * Transforms (rotates) the given vector by this quaternion and stores the result into the target vector and then returns the target.
		 * The target defaults to the given vector.
		 * @memberOf Quat
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Vec3} [target=a]
		 * @returns {Vec3} the target
		 */
		transformVec3: function(a, o) {
			// I hope this, finally, is the correct formula (https://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/)
			//	t = 2 * cross(q.xyz, v)
			//	v' = v + q.w * t + cross(q.xyz, t)
			
			o = o || a;
			var tx = 2.0 * (this[1] * a[2] - this[2] * a[1]);
			var ty = 2.0 * (this[2] * a[0] - this[0] * a[2]);
			var tz = 2.0 * (this[0] * a[1] - this[1] * a[0]);
			
			o[0] = a[0] + tx*this[3] + (this[1] * tz - this[2] * ty);
			o[1] = a[1] + ty*this[3] + (this[2] * tx - this[0] * tz);
			o[2] = a[2] + tz*this[3] + (this[0] * ty - this[1] * tx);
			return o;
		},
	};
	
	// select typeprototype
	weml.selectTypeprototype(Quat);
})();


/**
 * Constructs a new {@link Mat4} with the given values sourced from a typed array.
 * @class
 * @param {Float32Array} [values] - The initial x component of the vector
 * @returns {Vec3}
 */
var Mat4 = function(values) {
	var mat = weml.allocateArray(16);
	Object.assign(mat, Mat4.typeprototype._current);
	if(values) mat.set(values);
	return mat;
};

Mat4.typeprototype = {};
(function() {
// ## sisd implementation ##
	Mat4.typeprototype.sisd = {
		
		// 00 10 20 30
		// 01 11 21 31
		// 02 12 22 32
		// 03 13 23 33
		//
		// 00 04 08 12
		// 01 05 09 13
		// 02 06 10 14
		// 03 07 11 15
		//
		// find:
		// (?>(m00)|(m01)|(m02)|(m03)|(m10)|(m11)|(m12)|(m13)|(m20)|(m21)|(m22)|(m23)|(m30)|(m31)|(m32)|(m33))
		// replace:
		//	a(?1\[ 0\])(?2\[ 1\])(?3\[ 2\])(?4\[ 3\])(?5\[ 4\])(?6\[ 5\])(?7\[ 6\])(?8\[ 7\])(?9\[ 8\])(?10\[ 9\])(?11\[10\])(?12\[11\])(?13\[12\])(?14\[13\])(?15\[14\])(?16\[15\])
		//
		// leading zero array indices: (?<=\[)0(?=\d)
		//
		
		toString: function() {
			return "Mat4[" + this[0] + ", " + this[1] + "..." + this[14] + ", " + this[15] + "]";
		},
		
		/**
		 * Returns a new matrix with the same values as this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @returns {Mat4}
		 */
		clone: function() {
			return new Mat4(this);
		},
		
		/**
		 * Sets this matrix to identity and returns itself.
		 * Identity:<br>
		 * <code>(1, 0, 0, 0)</code><br>
		 * <code>(0, 1, 0, 0)</code><br>
		 * <code>(0, 0, 1, 0)</code><br>
		 * <code>(0, 0, 0, 1)</code>
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @returns {Mat4} itself
		 */
		identity: function() {
			this.fill(0);
			this[0] = 1;
			this[5] = 1;
			this[10] = 1;
			this[15] = 1;
			return this;
		},
		
		/**
		 * Zeroes this matrix to all zero and returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @returns {Mat4} itself
		 */
		zero: function() {
			this.fill(0);
			return this;
		},
		
		
		/**
		 * Sets this matrix to be equal with the given matrix and returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} a
		 * @returns {Mat4} itself
		 */
		set: function(a) {
			this[ 0] = a[ 0];
			this[ 1] = a[ 1];
			this[ 2] = a[ 2];
			this[ 3] = a[ 3];
			this[ 4] = a[ 4];
			this[ 5] = a[ 5];
			this[ 6] = a[ 6];
			this[ 7] = a[ 7];
			this[ 8] = a[ 8];
			this[ 9] = a[ 9];
			this[10] = a[10];
			this[11] = a[11];
			this[12] = a[12];
			this[13] = a[13];
			this[14] = a[14];
			this[15] = a[15];
			return this;
		},
		
		
		/**
		 * Sets the given matrix equal to this matrix and returns the given matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} o
		 * @returns {Mat4} the given matrix <code>o</code>
		 */
		get: function(o) {
			o.set(this);
			return o;
		},
		
		/**
		 * Puts this matrix into the given matrix or typed array and returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} a
		 * @returns {Mat4} itself
		 */
		put: function(a) {
			a.set(this);
			return this;
		},
		
		
		/**
		 * Multiplies this matrix and the given matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} a
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		mul: function(a, o) {
			o = o || this;
			var nm00 = this[ 0] * a[ 0] + this[ 4] * a[ 1] + this[ 8] * a[ 2] + this[12] * a[ 3];
			var nm01 = this[ 1] * a[ 0] + this[ 5] * a[ 1] + this[ 9] * a[ 2] + this[13] * a[ 3];
			var nm02 = this[ 2] * a[ 0] + this[ 6] * a[ 1] + this[10] * a[ 2] + this[14] * a[ 3];
			var nm03 = this[ 3] * a[ 0] + this[ 7] * a[ 1] + this[11] * a[ 2] + this[15] * a[ 3];
			var nm10 = this[ 0] * a[ 4] + this[ 4] * a[ 5] + this[ 8] * a[ 6] + this[12] * a[ 7];
			var nm11 = this[ 1] * a[ 4] + this[ 5] * a[ 5] + this[ 9] * a[ 6] + this[13] * a[ 7];
			var nm12 = this[ 2] * a[ 4] + this[ 6] * a[ 5] + this[10] * a[ 6] + this[14] * a[ 7];
			var nm13 = this[ 3] * a[ 4] + this[ 7] * a[ 5] + this[11] * a[ 6] + this[15] * a[ 7];
			var nm20 = this[ 0] * a[ 8] + this[ 4] * a[ 9] + this[ 8] * a[10] + this[12] * a[11];
			var nm21 = this[ 1] * a[ 8] + this[ 5] * a[ 9] + this[ 9] * a[10] + this[13] * a[11];
			var nm22 = this[ 2] * a[ 8] + this[ 6] * a[ 9] + this[10] * a[10] + this[14] * a[11];
			var nm23 = this[ 3] * a[ 8] + this[ 7] * a[ 9] + this[11] * a[10] + this[15] * a[11];
			var nm30 = this[ 0] * a[12] + this[ 4] * a[13] + this[ 8] * a[14] + this[12] * a[15];
			var nm31 = this[ 1] * a[12] + this[ 5] * a[13] + this[ 9] * a[14] + this[13] * a[15];
			var nm32 = this[ 2] * a[12] + this[ 6] * a[13] + this[10] * a[14] + this[14] * a[15];
			var nm33 = this[ 3] * a[12] + this[ 7] * a[13] + this[11] * a[14] + this[15] * a[15];
			o[ 0] = nm00;
			o[ 1] = nm01;
			o[ 2] = nm02;
			o[ 3] = nm03;
			o[ 4] = nm10;
			o[ 5] = nm11;
			o[ 6] = nm12;
			o[ 7] = nm13;
			o[ 8] = nm20;
			o[ 9] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			o[12] = nm30;
			o[13] = nm31;
			o[14] = nm32;
			o[15] = nm33;
			return o;
			
			/*
			o = o || this;
			o[ 0] = this[ 0] * a[ 0];
			o[ 1] = this[ 1] * a[ 1];
			o[ 2] = this[ 2] * a[ 2];
			o[ 3] = this[ 3] * a[ 3];
			o[ 4] = this[ 4] * a[ 4];
			o[ 5] = this[ 5] * a[ 5];
			o[ 6] = this[ 6] * a[ 6];
			o[ 7] = this[ 7] * a[ 7];
			o[ 8] = this[ 8] * a[ 8];
			o[ 9] = this[ 9] * a[ 9];
			o[10] = this[10] * a[10];
			o[11] = this[11] * a[11];
			o[12] = this[12] * a[12];
			o[13] = this[13] * a[13];
			o[14] = this[14] * a[14];
			o[15] = this[15] * a[15];
			return o;
			*/
		},
		
		
		/**
		 * Transposes this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		transpose: function(o) {
			o = o || this;
			var nm00 = this[ 0];
			var nm01 = this[ 4];
			var nm02 = this[ 8];
			var nm03 = this[12];
			var nm10 = this[ 1];
			var nm11 = this[ 5];
			var nm12 = this[ 9];
			var nm13 = this[13];
			var nm20 = this[ 2];
			var nm21 = this[ 6];
			var nm22 = this[10];
			var nm23 = this[14];
			var nm30 = this[ 3];
			var nm31 = this[ 7];
			var nm32 = this[11];
			var nm33 = this[15];
			o[ 0] = nm00;
			o[ 1] = nm01;
			o[ 2] = nm02;
			o[ 3] = nm03;
			o[ 4] = nm10;
			o[ 5] = nm11;
			o[ 6] = nm12;
			o[ 7] = nm13;
			o[ 8] = nm20;
			o[ 9] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			o[12] = nm30;
			o[13] = nm31;
			o[14] = nm32;
			o[15] = nm33;
			return o;
		},
		
		/**
		 * Inverts this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		invert: function(o) {
			o = o || this;
			var a = this[ 0] * this[ 5] - this[ 1] * this[ 4];
			var b = this[ 0] * this[ 6] - this[ 2] * this[ 4];
			var c = this[ 0] * this[ 7] - this[ 3] * this[ 4];
			var d = this[ 1] * this[ 6] - this[ 2] * this[ 5];
			var e = this[ 1] * this[ 7] - this[ 3] * this[ 5];
			var f = this[ 2] * this[ 7] - this[ 3] * this[ 6];
			var g = this[ 8] * this[13] - this[ 9] * this[12];
			var h = this[ 8] * this[14] - this[10] * this[12];
			var i = this[ 8] * this[15] - this[11] * this[12];
			var j = this[ 9] * this[14] - this[10] * this[13];
			var k = this[ 9] * this[15] - this[11] * this[13];
			var l = this[10] * this[15] - this[11] * this[14];
			var det = a * l - b * k + c * j + d * i - e * h + f * g;
			det = 1.0 / det;
			
			var nm00 = ( this[ 5] * l - this[ 6] * k + this[ 7] * j) * det;
			var nm01 = (-this[ 1] * l + this[ 2] * k - this[ 3] * j) * det;
			var nm02 = ( this[13] * f - this[14] * e + this[15] * d) * det;
			var nm03 = (-this[ 9] * f + this[10] * e - this[11] * d) * det;
			var nm10 = (-this[ 4] * l + this[ 6] * i - this[ 7] * h) * det;
			var nm11 = ( this[ 0] * l - this[ 2] * i + this[ 3] * h) * det;
			var nm12 = (-this[12] * f + this[14] * c - this[15] * b) * det;
			var nm13 = ( this[ 8] * f - this[10] * c + this[11] * b) * det;
			var nm20 = ( this[ 4] * k - this[ 5] * i + this[ 7] * g) * det;
			var nm21 = (-this[ 0] * k + this[ 1] * i - this[ 3] * g) * det;
			var nm22 = ( this[12] * e - this[13] * c + this[15] * a) * det;
			var nm23 = (-this[ 8] * e + this[ 9] * c - this[11] * a) * det;
			var nm30 = (-this[ 4] * j + this[ 5] * h - this[ 6] * g) * det;
			var nm31 = ( this[ 0] * j - this[ 1] * h + this[ 2] * g) * det;
			var nm32 = (-this[12] * d + this[13] * b - this[14] * a) * det;
			var nm33 = ( this[ 8] * d - this[ 9] * b + this[10] * a) * det;
			o[ 0] = nm00;
			o[ 1] = nm01;
			o[ 2] = nm02;
			o[ 3] = nm03;
			o[ 4] = nm10;
			o[ 5] = nm11;
			o[ 6] = nm12;
			o[ 7] = nm13;
			o[ 8] = nm20;
			o[ 9] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			o[12] = nm30;
			o[13] = nm31;
			o[14] = nm32;
			o[15] = nm33;
			return o;
		},
		
		/**
		 * Applies a translation transform by the given vector to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyTranslationVec3: function(a, o) {
			o = o || this;
			o[12] = this[ 0] * a[0] + this[ 4] * a[1] + this[ 8] * a[2] + this[12];
			o[13] = this[ 1] * a[0] + this[ 5] * a[1] + this[ 9] * a[2] + this[13];
			o[14] = this[ 2] * a[0] + this[ 6] * a[1] + this[10] * a[2] + this[14];
			o[15] = this[ 3] * a[0] + this[ 7] * a[1] + this[11] * a[2] + this[15];
			return o;
		},
		
		/**
		 * Applies a translation transform by the given vector to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyTranslationXYZ: function(x, y, z, o) {
			o = o || this;
			o[12] = this[ 0] * x + this[ 4] * y + this[ 8] * z + this[12];
			o[13] = this[ 1] * x + this[ 5] * y + this[ 9] * z + this[13];
			o[14] = this[ 2] * x + this[ 6] * y + this[10] * z + this[14];
			o[15] = this[ 3] * x + this[ 7] * y + this[11] * z + this[15];
			return o;
		},
		
		/**
		 * Sets this matrix to the translation transform described by the given vector and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Mat4} itself
		 */
		setTranslationVec3: function(a) {
			this.identity();
			this[12] = a[0];
			this[13] = a[1];
			this[14] = a[2];
			return this;
		},
		
		/**
		 * Sets this matrix to the translation transform described by the given vector and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Mat4} itself
		 */
		setTranslationXYZ: function(x, y, z) {
			this.identity();
			this[12] = a[0];
			this[13] = a[1];
			this[14] = a[2];
			return this;
		},
		
		/**
		 * Applies a rotation transform described by the given quaternion to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyRotationQuat: function(a, o) {
			o = o || this;
			var w2 = a[3] * a[3];
			var x2 = a[0] * a[0];
			var y2 = a[1] * a[1];
			var z2 = a[2] * a[2];
			var zw = a[2] * a[3];
			var xy = a[0] * a[1];
			var xz = a[0] * a[2];
			var yw = a[1] * a[3];
			var yz = a[1] * a[2];
			var xw = a[0] * a[3];
			var rm00 = w2 + x2 - z2 - y2;
			var rm01 = xy + zw + zw + xy;
			var rm02 = xz - yw + xz - yw;
			var rm10 = -zw + xy - zw + xy;
			var rm11 = y2 - z2 + w2 - x2;
			var rm12 = yz + yz + xw + xw;
			var rm20 = yw + xz + xz + yw;
			var rm21 = yz + yz - xw - xw;
			var rm22 = z2 - y2 - x2 + w2;
			var nm00 = this[ 0] * rm00 + this[ 4] * rm01 + this[ 8] * rm02;
			var nm01 = this[ 1] * rm00 + this[ 5] * rm01 + this[ 9] * rm02;
			var nm02 = this[ 2] * rm00 + this[ 6] * rm01 + this[10] * rm02;
			var nm03 = this[ 3] * rm00 + this[ 7] * rm01 + this[11] * rm02;
			var nm10 = this[ 0] * rm10 + this[ 4] * rm11 + this[ 8] * rm12;
			var nm11 = this[ 1] * rm10 + this[ 5] * rm11 + this[ 9] * rm12;
			var nm12 = this[ 2] * rm10 + this[ 6] * rm11 + this[10] * rm12;
			var nm13 = this[ 3] * rm10 + this[ 7] * rm11 + this[11] * rm12;
			o[ 8] = this[ 0] * rm20 + this[ 4] * rm21 + this[ 8] * rm22;
			o[ 9] = this[ 1] * rm20 + this[ 5] * rm21 + this[ 9] * rm22;
			o[10] = this[ 2] * rm20 + this[ 6] * rm21 + this[10] * rm22;
			o[11] = this[ 3] * rm20 + this[ 7] * rm21 + this[11] * rm22;
			o[ 0] = nm00;
			o[ 1] = nm01;
			o[ 2] = nm02;
			o[ 3] = nm03;
			o[ 4] = nm10;
			o[ 5] = nm11;
			o[ 6] = nm12;
			o[ 7] = nm13;
			o[12] = this[12];
			o[13] = this[13];
			o[14] = this[14];
			o[15] = this[15];
			return o;
		},
		
		/**
		 * Sets this matrix to the rotation transform described by the given quaternion and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Quat} a
		 * @returns {Mat4} itself
		 */
		setRotationQuat: function(a) {
			var w2 = a[3] * a[3];
			var x2 = a[0] * a[0];
			var y2 = a[1] * a[1];
			var z2 = a[2] * a[2];
			var zw = a[2] * a[3];
			var xy = a[0] * a[1];
			var xz = a[0] * a[2];
			var yw = a[1] * a[3];
			var yz = a[1] * a[2];
			var xw = a[0] * a[3];
			this[ 0] = w2 + x2 - z2 - y2;
			this[ 1] = xy + zw + zw + xy;
			this[ 2] = xz - yw + xz - yw;
			this[ 3] = 0.0;
			this[ 4] = -zw + xy - zw + xy;
			this[ 5] = y2 - z2 + w2 - x2;
			this[ 6] = yz + yz + xw + xw;
			this[ 7] = 0.0;
			this[ 8] = yw + xz + xz + yw;
			this[ 9] = yz + yz - xw - xw;
			this[10] = z2 - y2 - x2 + w2;
			
			this[11] = 0.0;
			
			this[12] = 0.0;
			this[13] = 0.0;
			this[14] = 0.0;
			this[15] = 1.0;
			return this;
		},
		
		/**
		 * Applies a scale transform described by the given vector to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyScaleVec3: function(a, o) {
			return this.applyScaleXYZ(a[0], a[1], a[2], o);
		},
		
		/**
		 * Applies a scale transform described by the given vector to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyScaleXYZ: function(x, y, z, o) {
			o = o || this;
			o[ 0] = this[ 0] * x;
			o[ 1] = this[ 1] * x;
			o[ 2] = this[ 2] * x;
			o[ 3] = this[ 3] * x;
			o[ 4] = this[ 4] * y;
			o[ 5] = this[ 5] * y;
			o[ 6] = this[ 6] * y;
			o[ 7] = this[ 7] * y;
			o[ 8] = this[ 8] * z;
			o[ 9] = this[ 9] * z;
			o[10] = this[10] * z;
			o[11] = this[11] * z;
			o[12] = this[12];
			o[13] = this[13];
			o[14] = this[14];
			o[15] = this[15];
			return o;
		},
		
		/**
		 * Applies a uniform scale transform described by the given scalar to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} s
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyScaleScalar: function(s, o) {
			return this.applyScaleXYZ(s, s, s, o);
		},
		
		/**
		 * Sets this matrix to the scale transform described by the given vector and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Vec3} a
		 * @returns {Mat4} itself
		 */
		setScaleVec3: function(a) {
			return this.setScaleXYZ(a[0], a[1], a[2]);
		},
		
		/**
		 * Sets this matrix to the scale transform described by the given vector and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} z
		 * @returns {Mat4} itself
		 */
		setScaleXYZ: function(x, y, z) {
			this.identity();
			this[ 0] = x;
			this[ 5] = y;
			this[10] = z;
			return this;
		},
		
		/**
		 * Sets this matrix to the scale transform described by the given scalar and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} s
		 * @returns {Mat4} itself
		 */
		setScaleScalar: function(s) {
			return this.setScaleXYZ(s, s, s);
		},
		
		/**
		 * Applies a perspective transform described by the given values to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} fovy
		 * @param {Number} aspect
		 * @param {Number} near
		 * @param {Number} far
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyPerspective: function(fovy, aspect, near, far, o) {
			o = o || this;
			var h = Math.tan(fovy * 0.5);
			
			// calculate right matrix elements
			var rm00 = 1.0 / (h * aspect);
			var rm11 = 1.0 / h;
			var rm22;
			var rm32;
			/*
			boolean farInf = far > 0 && Float.isInfinite(far);
			boolean nearInf = near > 0 && Float.isInfinite(near);
			if (farInf) {
				// See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
				float e = 1E-6f;
				rm22 = e - 1.0f;
				rm32 = (e - (zZeroToOne ? 1.0f : 2.0f)) * near;
			} else if (nearInf) {
				float e = 1E-6f;
				rm22 = (zZeroToOne ? 0.0f : 1.0f) - e;
				rm32 = ((zZeroToOne ? 1.0f : 2.0f) - e) * far;
			} else {
			*/
			var zZeroToOne = false;
			rm22 = (zZeroToOne ? far : far + near) / (near - far);
			rm32 = (zZeroToOne ? far : far + far) * near / (near - far);
			/*
			}
			*/
			// perform optimized matrix multiplication
			var nm20 = this[ 8] * rm22 - this[12];
			var nm21 = this[ 9] * rm22 - this[13];
			var nm22 = this[10] * rm22 - this[14];
			var nm23 = this[11] * rm22 - this[15];
			o[ 0] = this[ 0] * rm00;
			o[ 1] = this[ 1] * rm00;
			o[ 2] = this[ 2] * rm00;
			o[ 3] = this[ 3] * rm00;
			o[ 4] = this[ 4] * rm11;
			o[ 5] = this[ 5] * rm11;
			o[ 6] = this[ 6] * rm11;
			o[ 7] = this[ 7] * rm11;
			o[12] = this[ 8] * rm32;
			o[13] = this[ 9] * rm32;
			o[14] = this[10] * rm32;
			o[15] = this[11] * rm32;
			o[ 8] = nm20;
			o[ 9] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			return o;
		},
		
		/**
		 * Sets this matrix to the perspective transform described by the given values and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} fovy
		 * @param {Number} aspect
		 * @param {Number} near
		 * @param {Number} far
		 * @returns {Mat4} itself
		 */
		setPerspective: function(fovy, aspect, near, far) {
			this.identity();
			this.applyPerspective(fovy, aspect, near, far, this);
			return this;
		},
		
		/**
		 * Applies an ortho transform described by the given values to this matrix and stores the result into the target matrix and then returns the target.
		 * The target matrix defaults to this matrix.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} left
		 * @param {Number} right
		 * @param {Number} bottom
		 * @param {Number} top
		 * @param {Number} near
		 * @param {Number} far
		 * @param {Mat4} [target=this]
		 * @returns {Mat4} the target
		 */
		applyOrtho: function(left, right, bottom, top, near, far, o) {
			o = o || this;
			
			// calculate right matrix elements
			var rm00 = 2.0 / (right - left);
			var rm11 = 2.0 / (top - bottom);
			var rm22 = 2.0 / (near - far);
			var rm30 = (left + right) / (left - right);
			var rm31 = (top + bottom) / (bottom - top);
			var rm32 = (far + near) / (near - far);
			
			// perform optimized multiplication
			// compute the last column first, because other columns do not depend on it
			o[12] = this[ 0] * rm30 + this[ 4] * rm31 + this[ 8] * rm32 + this[12];
			o[13] = this[ 1] * rm30 + this[ 5] * rm31 + this[ 9] * rm32 + this[13];
			o[14] = this[ 2] * rm30 + this[ 6] * rm31 + this[10] * rm32 + this[14];
			o[15] = this[ 3] * rm30 + this[ 7] * rm31 + this[11] * rm32 + this[15];
			o[ 0] = this[ 0] * rm00;
			o[ 1] = this[ 1] * rm00;
			o[ 2] = this[ 2] * rm00;
			o[ 3] = this[ 3] * rm00;
			o[ 4] = this[ 4] * rm11;
			o[ 5] = this[ 5] * rm11;
			o[ 6] = this[ 6] * rm11;
			o[ 7] = this[ 7] * rm11;
			o[ 8] = this[ 8] * rm22;
			o[ 9] = this[ 9] * rm22;
			o[10] = this[10] * rm22;
			o[11] = this[11] * rm22;
			
			return o;
		},
		
		/**
		 * Sets this matrix to an ortho transform described by the given values and then returns itself.
		 * @memberOf Mat4
		 * @instance
		 * @function
		 * @param {Number} left
		 * @param {Number} right
		 * @param {Number} bottom
		 * @param {Number} top
		 * @param {Number} near
		 * @param {Number} far
		 * @returns {Mat4} itself
		 */
		setOrtho: function(left, right, bottom, top, near, far) {
			this.identity();
			this.applyOrtho(left, right, bottom, top, near, far, this);
			return this;
		},
	};
	
	// select typeprototype
	weml.selectTypeprototype(Mat4);
})();

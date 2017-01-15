
var weml = {
	allocateArray: function(size) {
		return new Float32Array(size);
	},
	
	selectTypeprototype: function(clazz) {
		const hasSIMD = window.SIMD !== undefined;
		clazz.typeprototype._current = (hasSIMD ? clazz.typeprototype.simd : null) || clazz.typeprototype.sisd;
	},
	
	toRadians: function(x) {
		return x * (Math.PI / 180);
	},
	toDegrees: function(x) {
		return x * (180 / Math.PI);
	},
	
	rand(min, max) {
		return (Math.random() * (max - min)) + min;
	},
	randVec3(min, max, o) {
		o = o || new Vec3();
		min = min || -1.0;
		max = max || 1.0;
		o[0] = this.rand(min, max);
		o[1] = this.rand(min, max);
		o[2] = this.rand(min, max);
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


// ### class Vec3 ###
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
		
		size: function() {
			return 3;
		},
		
		clone: function() {
			return new Vec3(this[0], this[1], this[2]);
		},
		
		identity: function() {
			this.set(0, 0, 0);
			return this;
		},
		zero: function() {
			this.set(0, 0, 0);
			return this;
		},
		
		set: function(a) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			return this;
		},
		setXYZ: function(x, y, z) {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			return this;
		},
		setX: function(x) {
			this[0] = x;
			return this;
		},
		setY: function(y) {
			this[1] = y;
			return this;
		},
		setZ: function(z) {
			this[2] = z;
			return this;
		},
		setScalar: function(s) {
			this.setXYZ(s, s, s);
			return this;
		},
		
		get: function(o) {
			o[0] = this[0];
			o[1] = this[1];
			o[2] = this[2];
			return o;
		},
		getX: function() {
			return this[0];
		},
		getY: function() {
			return this[1];
		},
		getZ: function() {
			return this[2];
		},
		put: function(a, offset) {
			offset = offset || 0;
			a[0 + offset] = this[0];
			a[1 + offset] = this[1];
			a[2 + offset] = this[2];
			return this;
		},
		
		add: function(a, o) {
			o = o || this;
			o[0] = this[0] + a[0];
			o[1] = this[1] + a[1];
			o[2] = this[2] + a[2];
			return o;
		},
		addXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] + x;
			o[1] = this[1] + y;
			o[2] = this[2] + z;
			return o;
		},
		addScalar: function(s, o) {
			o = o || this;
			this.addXYZ(s, s, s, o);
			return o;
		},
		
		sub: function(a, o) {
			o = o || this;
			o[0] = this[0] - a[0];
			o[1] = this[1] - a[1];
			o[2] = this[2] - a[2];
			return o;
		},
		subXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] - x;
			o[1] = this[1] - y;
			o[2] = this[2] - z;
			return o;
		},
		subScalar: function(s, o) {
			o = o || this;
			this.subXYZ(s, s, s, o);
			return o;
		},
		
		mul: function(a, o) {
			o = o || this;
			o[0] = this[0] * a[0];
			o[1] = this[1] * a[1];
			o[2] = this[2] * a[2];
			return o;
		},
		mulXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] * x;
			o[1] = this[1] * y;
			o[2] = this[2] * z;
			return o;
		},
		mulScalar: function(s, o) {
			o = o || this;
			this.mulXYZ(s, s, s, o);
			return o;
		},
		
		div: function(a, o) {
			o = o || this;
			o[0] = this[0] / a[0];
			o[1] = this[1] / a[1];
			o[2] = this[2] / a[2];
			return o;
		},
		divXYZ: function(x, y, z, o) {
			o = o || this;
			o[0] = this[0] / x;
			o[1] = this[1] / y;
			o[2] = this[2] / z;
			return o;
		},
		divScalar: function(s, o) {
			o = o || this;
			this.divXYZ(s, s, s, o);
			return o;
		},
		
		muladd: function(a, b, o) {
			o = o || this;
			o.mul(a).add(b);
			return o;
		},
		muladdXYZ: function(ax, ay, az, bx, by, bz, o) {
			o = o || this;
			o.mulXYZ(ax, ay, az).addXYZ(bx, by, bz);
			return o;
		},
		
		dot: function(a) {
			return this[0]*a[0] + this[1]*a[1] + this[2]*a[2];
		},
		dotXYZ: function(x, y, z) {
			return this[0]*x + this[1]*y + this[2]*z;
		},
		
		normalize: function(o) {
			o = o || this;
			var invlength = this.invmagnitude();
			o[0] = this[0] * invlength;
			o[1] = this[1] * invlength;
			o[2] = this[2] * invlength;
			return o;
		},
		
		cross: function(a, o) {
			o = o || this;
			this[0] = this[1] * a[2] - this[2] * a[1];
			this[1] = this[2] * a[0] - this[0] * a[2];
			this[2] = this[0] * a[1] - this[1] * a[0];
			return o;
		},
		crossXYZ: function(x, y, z, o) {
			o = o || this;
			this[0] = this[1] * z - this[2] * y;
			this[1] = this[2] * x - this[0] * z;
			this[2] = this[0] * y - this[1] * x;
			return o;
		},
		
		magnitude: function() {
			return Math.sqrt(this[0]*this[0] + this[1]*this[1] + this[2]*this[2]);
		},
		magnitudesq: function() {
			return this[0]*this[0] + this[1]*this[1] + this[2]*this[2];
		},
		invmagnitude: function() {
			return 1.0 / this.magnitude();
		},
		invmagnitudesq: function() {
			return 1.0 / this.magnitudesq();
		},
		
		dist: function(a) {
			return Math.sqrt(this.distsq(a));
		},
		distXYZ: function(x, y, z) {
			return Math.sqrt(this.distsqXYZ(x, y, z));
		},
		distsq: function(a) {
			var dx = this[0] - a[0];
			var dy = this[1] - a[1];
			var dz = this[2] - a[2];
			return dx*dx + dy*dy + dz*dz;
		},
		distsqXYZ: function(x, y, z) {
			var dx = this[0] - x;
			var dy = this[1] - y;
			var dz = this[2] - z;
			return dx*dx + dy*dy + dz*dz;
		},
		
		negate: function(o) {
			o = o || this;
			o[0] = -this[0];
			o[1] = -this[1];
			o[2] = -this[2];
			return o;
		},
		
		reflect: function(normal, o) {
			o = o || this;
			var dot = this.dot(normal);
			o[0] = this[0] - (dot + dot) * normal[0];
			o[1] = this[1] - (dot + dot) * normal[1];
			o[2] = this[2] - (dot + dot) * normal[2];
			return o;
		},
		reflectXYZ: function(x, y, z, o) {
			o = o || this;
			var dot = this.dotXYZ(x, y, z);
			o[0] = this[0] - (dot + dot) * x;
			o[1] = this[1] - (dot + dot) * y;
			o[2] = this[2] - (dot + dot) * z;
			return o;
		},
		
		half: function(a, o) {
			o = o || this;
			o.add(a).normalize();
			return o;
		},
		halfXYZ: function(x, y, z, o) {
			o = o || this;
			o.addXYZ(x, y, z).normalize();
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


// ### class Vec4 ###
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
		
		clone: function() {
			return new Vec4(this[0], this[1], this[2], this[3]);
		},
		
		identity: function() {
			return this.set(0, 0, 0, 1);
		},
		zero: function() {
			return this.set(0, 0, 0, 0);
		},
		
		set: function(a) {
			this[0] = a[0];
			this[1] = a[1];
			this[2] = a[2];
			this[3] = a[3];
			return this;
		},
		setXYZW: function(x, y, z, w) {
			this[0] = x;
			this[1] = y;
			this[2] = z;
			this[3] = w;
			return this;
		},
		setX: function(x) {
			this[0] = x;
			return this;
		},
		setY: function(y) {
			this[1] = y;
			return this;
		},
		setZ: function(z) {
			this[2] = z;
			return this;
		},
		setW: function(w) {
			this[3] = w;
			return this;
		},
		
		put: function(a) {
			a[0] = this[0];
			a[1] = this[1];
			a[2] = this[2];
			a[3] = this[3];
			return this;
		},
		get: function(o) {
			o[0] = this[0];
			o[1] = this[1];
			o[2] = this[2];
			o[3] = this[3];
			return o;
		},
		getX: function() {
			return this[0];
		},
		getY: function() {
			return this[1];
		},
		getZ: function() {
			return this[2];
		},
		getW: function() {
			return this[3];
		},
		
		add: function(a, o) {
			o = o || this;
			o[0] = this[0] + a[0];
			o[1] = this[1] + a[1];
			o[2] = this[2] + a[2];
			o[3] = this[3] + a[3];
			return o;
		},
		addXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] + x;
			o[1] = this[1] + y;
			o[2] = this[2] + z;
			o[3] = this[3] + w;
			return o;
		},
		addScalar: function(s, o) {
			o = o || this;
			this.addXYZW(s, s, s, s, o);
			return o;
		},
		
		sub: function(a, o) {
			o = o || this;
			o[0] = this[0] - a[0];
			o[1] = this[1] - a[1];
			o[2] = this[2] - a[2];
			o[3] = this[3] - a[3];
			return o;
		},
		subXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] - x;
			o[1] = this[1] - y;
			o[2] = this[2] - z;
			o[3] = this[3] - w;
			return o;
		},
		subScalar: function(s, o) {
			o = o || this;
			this.subXYZW(s, s, s, s, o);
			return o;
		},
		
		mul: function(a, o) {
			o = o || this;
			o[0] = this[0] * a[0];
			o[1] = this[1] * a[1];
			o[2] = this[2] * a[2];
			o[3] = this[3] * a[3];
			return o;
		},
		mulXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] * x;
			o[1] = this[1] * y;
			o[2] = this[2] * z;
			o[3] = this[3] * w;
			return o;
		},
		mulScalar: function(s, o) {
			o = o || this;
			mulXYZW(s, s, s, s, o);
			return o;
		},
		
		div: function(a, o) {
			o = o || this;
			o[0] = this[0] / a[0];
			o[1] = this[1] / a[1];
			o[2] = this[2] / a[2];
			o[3] = this[3] / a[3];
			return o;
		},
		divXYZW: function(x, y, z, w, o) {
			o = o || this;
			o[0] = this[0] / x;
			o[1] = this[1] / y;
			o[2] = this[2] / z;
			o[3] = this[3] / w;
			return o;
		},
		divScalar: function(s, o) {
			o = o || this;
			this.divXYZW(s, s, s, s, o);
			return o;
		},
	};
	
	// select typeprototype
	weml.selectTypeprototype(Vec4);
})();


// ### class Quat ###
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
		
	}
	
	// select typeprototype
	weml.selectTypeprototype(Quat);
})();


// ### class Mat4 ###
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
		//	a(?1\[00\])(?2\[01\])(?3\[02\])(?4\[03\])(?5\[04\])(?6\[05\])(?7\[06\])(?8\[07\])(?9\[08\])(?10\[09\])(?11\[10\])(?12\[11\])(?13\[12\])(?14\[13\])(?15\[14\])(?16\[15\])
		
		toString: function() {
			return "Mat4[" + this[0] + ", " + this[1] + "..." + this[14] + ", " + this[15] + "]";
		},
		
		clone: function() {
			return new Mat4(this);
		},
		
		identity: function() {
			this.fill(0);
			this[0] = 1;
			this[5] = 1;
			this[10] = 1;
			this[15] = 1;
			return this;
		},
		zero: function() {
			this.fill(0);
			return this;
		},
		
		set: function(a) {
			this[00] = a[00];
			this[01] = a[01];
			this[02] = a[02];
			this[03] = a[03];
			this[04] = a[04];
			this[05] = a[05];
			this[06] = a[06];
			this[07] = a[07];
			this[08] = a[08];
			this[09] = a[09];
			this[10] = a[10];
			this[11] = a[11];
			this[12] = a[12];
			this[13] = a[13];
			this[14] = a[14];
			this[15] = a[15];
			return this;
		},
		
		get: function(o) {
			o.set(this);
			return o;
		},
		put: function(a) {
			a.set(this);
			return this;
		},
		
		mul: function(a, o) {
			o = o || this;
			var nm00 = this[00] * a[00] + this[04] * a[01] + this[08] * a[02] + this[12] * a[03];
			var nm01 = this[01] * a[00] + this[05] * a[01] + this[09] * a[02] + this[13] * a[03];
			var nm02 = this[02] * a[00] + this[06] * a[01] + this[10] * a[02] + this[14] * a[03];
			var nm03 = this[03] * a[00] + this[07] * a[01] + this[11] * a[02] + this[15] * a[03];
			var nm10 = this[00] * a[04] + this[04] * a[05] + this[08] * a[06] + this[12] * a[07];
			var nm11 = this[01] * a[04] + this[05] * a[05] + this[09] * a[06] + this[13] * a[07];
			var nm12 = this[02] * a[04] + this[06] * a[05] + this[10] * a[06] + this[14] * a[07];
			var nm13 = this[03] * a[04] + this[07] * a[05] + this[11] * a[06] + this[15] * a[07];
			var nm20 = this[00] * a[08] + this[04] * a[09] + this[08] * a[10] + this[12] * a[11];
			var nm21 = this[01] * a[08] + this[05] * a[09] + this[09] * a[10] + this[13] * a[11];
			var nm22 = this[02] * a[08] + this[06] * a[09] + this[10] * a[10] + this[14] * a[11];
			var nm23 = this[03] * a[08] + this[07] * a[09] + this[11] * a[10] + this[15] * a[11];
			var nm30 = this[00] * a[12] + this[04] * a[13] + this[08] * a[14] + this[12] * a[15];
			var nm31 = this[01] * a[12] + this[05] * a[13] + this[09] * a[14] + this[13] * a[15];
			var nm32 = this[02] * a[12] + this[06] * a[13] + this[10] * a[14] + this[14] * a[15];
			var nm33 = this[03] * a[12] + this[07] * a[13] + this[11] * a[14] + this[15] * a[15];
			o[00] = nm00;
			o[01] = nm01;
			o[02] = nm02;
			o[03] = nm03;
			o[04] = nm10;
			o[05] = nm11;
			o[06] = nm12;
			o[07] = nm13;
			o[08] = nm20;
			o[09] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			o[12] = nm30;
			o[13] = nm31;
			o[14] = nm32;
			o[15] = nm33;
			return o;
			
			/*
			o = o || this;
			o[00] = this[00] * a[00];
			o[01] = this[01] * a[01];
			o[02] = this[02] * a[02];
			o[03] = this[03] * a[03];
			o[04] = this[04] * a[04];
			o[05] = this[05] * a[05];
			o[06] = this[06] * a[06];
			o[07] = this[07] * a[07];
			o[08] = this[08] * a[08];
			o[09] = this[09] * a[09];
			o[10] = this[10] * a[10];
			o[11] = this[11] * a[11];
			o[12] = this[12] * a[12];
			o[13] = this[13] * a[13];
			o[14] = this[14] * a[14];
			o[15] = this[15] * a[15];
			return o;
			*/
		},
		
		translate: function(a, o) {
			o = o || this;
			o[12] = this[00] * a[0] + this[04] * a[1] + this[08] * a[2] + this[12];
			o[13] = this[01] * a[0] + this[05] * a[1] + this[09] * a[2] + this[13];
			o[14] = this[02] * a[0] + this[06] * a[1] + this[10] * a[2] + this[14];
			o[15] = this[03] * a[0] + this[07] * a[1] + this[11] * a[2] + this[15];
			return o;
		},
		translateXYZ: function(x, y, z, o) {
			o = o || this;
			o[12] = this[00] * x + this[04] * y + this[08] * z + this[12];
			o[13] = this[01] * x + this[05] * y + this[09] * z + this[13];
			o[14] = this[02] * x + this[06] * y + this[10] * z + this[14];
			o[15] = this[03] * x + this[07] * y + this[11] * z + this[15];
			return o;
		},
		
		perspective: function(fovy, aspect, near, far, o) {
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
			const zZeroToOne = false;
			rm22 = (zZeroToOne ? far : far + near) / (near - far);
			rm32 = (zZeroToOne ? far : far + far) * near / (near - far);
			/*
			}
			*/
			// perform optimized matrix multiplication
			var nm20 = this[08] * rm22 - this[12];
			var nm21 = this[09] * rm22 - this[13];
			var nm22 = this[10] * rm22 - this[14];
			var nm23 = this[11] * rm22 - this[15];
			o[00] = this[00] * rm00;
			o[01] = this[01] * rm00;
			o[02] = this[02] * rm00;
			o[03] = this[03] * rm00;
			o[04] = this[04] * rm11;
			o[05] = this[05] * rm11;
			o[06] = this[06] * rm11;
			o[07] = this[07] * rm11;
			o[12] = this[08] * rm32;
			o[13] = this[09] * rm32;
			o[14] = this[10] * rm32;
			o[15] = this[11] * rm32;
			o[08] = nm20;
			o[09] = nm21;
			o[10] = nm22;
			o[11] = nm23;
			return o;
		},
	};
	
	// select typeprototype
	weml.selectTypeprototype(Mat4);
})();

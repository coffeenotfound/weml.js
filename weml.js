
var weml = {
	allocateArray: function(size) {
		return new Float32Array(size);
	},
	
	selectTypeprototype: function(clazz) {
		const hasSIMD = window.SIMD !== undefined;
		clazz.typeprototype._current = (hasSIMD ? clazz.typeprototype.simd : null) || clazz.typeprototype.sisd;
	},
};


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
		put: function(a) {
			a[0] = this[0];
			a[1] = this[1];
			a[2] = this[2];
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
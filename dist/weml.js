var weml = {
    allocateArray: function(size) {
        return new Float32Array(size);
    },
    selectTypeprototype: function(clazz) {
        var hasSIMD = window.SIMD !== undefined;
        clazz.typeprototype._current = (hasSIMD ? clazz.typeprototype.simd : null) || clazz.typeprototype.sisd;
    },
    modmod: function(x, y) {
        return (x % n + n) % n;
    },
    radmod: function(x) {
        return this.modmod(x + Math.PI, Math.PI * 2) - Math.PI;
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
        return Math.random() * (max - min) + min;
    },
    randVec3: function(min, max, o) {
        o = o || new Vec3();
        min = min || -1;
        max = max || 1;
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
    }
};

$(function() {
    console.group("weml.js test");
    var a = new Vec3(1, 2, 3);
    var b = new Vec3(10, 10, 10);
    var c = new Vec3(-5, -5, -5);
    console.log("a =", a);
    console.log("b =", b);
    console.log("c =", c);
    console.log("");
    console.log("a.put(b).mul(c).mulScalar(2).get(c).addXYZ(1,1,1) =", a.put(b).mul(c).mulScalar(2).get(c).addXYZ(1, 1, 1));
    console.log("");
    console.log("a =", a);
    console.log("b =", b);
    console.log("c =", c);
    console.groupEnd();
});

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
    Vec3.typeprototype.sisd = {
        toString: function() {
            return "Vec3[" + this[0] + ", " + this[1] + ", " + this[2] + "]";
        },
        size: function() {
            return 3;
        },
        clone: function() {
            return new Vec3(this[0], this[1], this[2]);
        },
        identity: function() {
            this.setXYZ(0, 0, 0);
            return this;
        },
        zero: function() {
            this.setXYZ(0, 0, 0);
            return this;
        },
        set: function(a) {
            this[0] = a[0];
            this[1] = a[1];
            this[2] = a[2];
            return this;
        },
        setSwizzle: function(a, swizzlex, swizzley, swizzlez) {
            var nx = a[swizzlex];
            var ny = a[swizzley];
            var nz = a[swizzlez];
            this[0] = nx;
            this[1] = ny;
            this[2] = nz;
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
            return this[0] * a[0] + this[1] * a[1] + this[2] * a[2];
        },
        dotXYZ: function(x, y, z) {
            return this[0] * x + this[1] * y + this[2] * z;
        },
        normalize: function(o) {
            o = o || this;
            var invlength = this.invmagnitude();
            if (!Number.isNaN(invlength)) {
                o[0] = this[0] * invlength;
                o[1] = this[1] * invlength;
                o[2] = this[2] * invlength;
            }
            return o;
        },
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
        magnitude: function() {
            return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
        },
        magnitudesq: function() {
            return this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
        },
        invmagnitude: function() {
            return 1 / this.magnitude();
        },
        invmagnitudesq: function() {
            return 1 / this.magnitudesq();
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
            return dx * dx + dy * dy + dz * dz;
        },
        distsqXYZ: function(x, y, z) {
            var dx = this[0] - x;
            var dy = this[1] - y;
            var dz = this[2] - z;
            return dx * dx + dy * dy + dz * dz;
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
        clampLength: function(min, max, o) {
            o = o || this;
            var lensq = this.magnitudesq();
            if (lensq < min * min) {
                var invlen = 1 / Math.sqrt(lensq);
                o[0] = this[0] * invlen * min;
                o[1] = this[1] * invlen * min;
                o[2] = this[2] * invlen * min;
            } else if (lensq > max * max) {
                var invlenn = 1 / Math.sqrt(lensq);
                o[0] = this[0] * invlenn * max;
                o[1] = this[1] * invlenn * max;
                o[2] = this[2] * invlenn * max;
            }
            return o;
        },
        lerp: function(a, t, o) {
            o = o || this;
            o[0] = this[0] + (a[0] - this[0]) * t;
            o[1] = this[1] + (a[1] - this[1]) * t;
            o[2] = this[2] + (a[2] - this[2]) * t;
            return o;
        },
        lerpXYZ: function(x, y, z, o) {
            o = o || this;
            o[0] = this[0] + (x - this[0]) * t;
            o[1] = this[1] + (y - this[1]) * t;
            o[2] = this[2] + (z - this[2]) * t;
            return o;
        }
    };
    Vec3.typeprototype.simd = Object.assign(Object.create(Vec3.typeprototype.sisd), {
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
        }
    });
    weml.selectTypeprototype(Vec3);
})();

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
        }
    };
    weml.selectTypeprototype(Vec4);
})();

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
    Quat.typeprototype.sisd = {
        clone: function() {
            var quat = new Quat();
            quat.set(this);
            return quat;
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
        identity: function() {
            this[0] = 0;
            this[1] = 0;
            this[2] = 0;
            this[3] = 1;
            return this;
        },
        zero: function() {
            this[0] = 0;
            this[1] = 0;
            this[2] = 0;
            this[3] = 0;
            return this;
        },
        mul: function(a, o) {
            o = o || this;
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
        mulXYZW: function(x, y, z, w, o) {
            o = o || this;
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
        mulScalar: function(s, o) {
            o = o || this;
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
        normalize: function(o) {
            o = o || this;
            var invMag = 1 / Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]);
            o[0] = this[0] * invMag;
            o[1] = this[1] * invMag;
            o[2] = this[2] * invMag;
            o[3] = this[3] * invMag;
            return o;
        },
        invert: function(o) {
            o = o || this;
            var invNorm = 1 / this.norm();
            o[0] = -this[0] * invNorm;
            o[1] = -this[1] * invNorm;
            o[2] = -this[2] * invNorm;
            o[3] = this[3] * invNorm;
            return o;
        },
        conjugate: function(o) {
            o = o || this;
            o[0] = -this[0];
            o[1] = -this[1];
            o[2] = -this[2];
            o[3] = this[3];
            return o;
        },
        norm: function() {
            return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
        },
        rotateXYZ: function(radx, rady, radz, o) {
            o = o || this;
            var sx = Math.sin(radx * .5);
            var cx = Math.cos(radx * .5);
            var sy = Math.sin(rady * .5);
            var cy = Math.cos(rady * .5);
            var sz = Math.sin(radz * .5);
            var cz = Math.cos(radz * .5);
            var cycz = cy * cz;
            var sysz = sy * sz;
            var sycz = sy * cz;
            var cysz = cy * sz;
            var w = cx * cycz - sx * sysz;
            var x = sx * cycz + cx * sysz;
            var y = cx * sycz - sx * cysz;
            var z = cx * cysz + sx * sycz;
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
        rotateLocalXYZ: function(radx, rady, radz, o) {
            o = o || this;
            var thetaX = radx * .5;
            var thetaY = rady * .5;
            var thetaZ = radz * .5;
            var thetaMagSq = thetaX * thetaX + thetaY * thetaY + thetaZ * thetaZ;
            var s;
            var dqX, dqY, dqZ, dqW;
            if (thetaMagSq * thetaMagSq / 24 < 1e-8) {
                dqW = 1 - thetaMagSq * .5;
                s = 1 - thetaMagSq / 6;
            } else {
                var thetaMag = Math.sqrt(thetaMagSq);
                var sin = Math.sin(thetaMag);
                s = sin / thetaMag;
                dqW = Math.cos(thetaMag);
            }
            dqX = thetaX * s;
            dqY = thetaY * s;
            dqZ = thetaZ * s;
            o[0] = dqW * this[0] + dqX * this[3] + dqY * this[2] - dqZ * this[1];
            o[1] = dqW * this[1] - dqX * this[2] + dqY * this[3] + dqZ * this[0];
            o[2] = dqW * this[2] + dqX * this[1] - dqY * this[0] + dqZ * this[3];
            o[3] = dqW * this[3] - dqX * this[0] - dqY * this[1] - dqZ * this[2];
            return o;
        },
        rotateAroundAxisXYZ: function(axisx, axisy, axisz, angle, o) {
            o = o || this;
            var hangle = angle * .5;
            var sinAngle = Math.sin(hangle);
            var invVLength = 1 / Math.sqrt(axisx * axisx + axisy * axisy + axisz * axisz);
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
        rotateAroundLocalAxisXYZ: function(axisx, axisy, axisz, angle, o) {},
        rotateTo: function(eye, center, o) {
            o = o || this;
            var x = eye[1] * center[2] - eye[2] * center[1];
            var y = eye[2] * center[0] - eye[0] * center[2];
            var z = eye[0] * center[1] - eye[1] * center[0];
            var w = Math.sqrt((eye[0] * eye[0] + eye[1] * eye[1] + eye[2] * eye[2]) * (center[0] * center[0] + center[1] * center[1] + center[2] * center[2])) + (eye[0] * center[0] + eye[1] * center[1] + eye[2] * center[2]);
            var invNorm = 1 / Math.sqrt(x * x + y * y + z * z + w * w);
            x *= invNorm;
            y *= invNorm;
            z *= invNorm;
            w *= invNorm;
            o[0] = this[3] * x + this[0] * w + this[1] * z - this[2] * y;
            o[1] = this[3] * y - this[0] * z + this[1] * w + this[2] * x;
            o[2] = this[3] * z + this[0] * y - this[1] * x + this[2] * w;
            o[3] = this[3] * w - this[0] * x - this[1] * y - this[2] * z;
            return o;
        },
        diff: function(a, o) {
            o = o || this;
            var invNorm = 1 / this.norm();
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
        slerp: function(a, alpha, o) {
            o = o || this;
            var cosom = this[0] * a[0] + this[1] * a[1] + this[2] * a[2] + this[3] * a[3];
            var absCosom = Math.abs(cosom);
            var scale0, scale1;
            if (1 - absCosom > 1e-6) {
                var sinSqr = 1 - absCosom * absCosom;
                var sinom = 1 / Math.sqrt(sinSqr);
                var omega = Math.atan2(sinSqr * sinom, absCosom);
                scale0 = Math.sin((1 - alpha) * omega) * sinom;
                scale1 = Math.sin(alpha * omega) * sinom;
            } else {
                scale0 = 1 - alpha;
                scale1 = alpha;
            }
            scale1 = cosom >= 0 ? scale1 : -scale1;
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
        lerp: function(a, alpha, o) {},
        transformVec3: function(a, o) {
            o = o || a;
            var tx = 2 * (this[1] * a[2] - this[2] * a[1]);
            var ty = 2 * (this[2] * a[0] - this[0] * a[2]);
            var tz = 2 * (this[0] * a[1] - this[1] * a[0]);
            o[0] = a[0] + tx * this[3] + (this[1] * tz - this[2] * ty);
            o[1] = a[1] + ty * this[3] + (this[2] * tx - this[0] * tz);
            o[2] = a[2] + tz * this[3] + (this[0] * ty - this[1] * tx);
            return o;
        }
    };
    weml.selectTypeprototype(Quat);
})();

var Mat4 = function(values) {
    var mat = weml.allocateArray(16);
    Object.assign(mat, Mat4.typeprototype._current);
    if (values) mat.set(values);
    return mat;
};

Mat4.typeprototype = {};

(function() {
    Mat4.typeprototype.sisd = {
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
            this[0] = a[0];
            this[1] = a[1];
            this[2] = a[2];
            this[3] = a[3];
            this[4] = a[4];
            this[5] = a[5];
            this[6] = a[6];
            this[7] = a[7];
            this[8] = a[8];
            this[9] = a[9];
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
            var nm00 = this[0] * a[0] + this[4] * a[1] + this[8] * a[2] + this[12] * a[3];
            var nm01 = this[1] * a[0] + this[5] * a[1] + this[9] * a[2] + this[13] * a[3];
            var nm02 = this[2] * a[0] + this[6] * a[1] + this[10] * a[2] + this[14] * a[3];
            var nm03 = this[3] * a[0] + this[7] * a[1] + this[11] * a[2] + this[15] * a[3];
            var nm10 = this[0] * a[4] + this[4] * a[5] + this[8] * a[6] + this[12] * a[7];
            var nm11 = this[1] * a[4] + this[5] * a[5] + this[9] * a[6] + this[13] * a[7];
            var nm12 = this[2] * a[4] + this[6] * a[5] + this[10] * a[6] + this[14] * a[7];
            var nm13 = this[3] * a[4] + this[7] * a[5] + this[11] * a[6] + this[15] * a[7];
            var nm20 = this[0] * a[8] + this[4] * a[9] + this[8] * a[10] + this[12] * a[11];
            var nm21 = this[1] * a[8] + this[5] * a[9] + this[9] * a[10] + this[13] * a[11];
            var nm22 = this[2] * a[8] + this[6] * a[9] + this[10] * a[10] + this[14] * a[11];
            var nm23 = this[3] * a[8] + this[7] * a[9] + this[11] * a[10] + this[15] * a[11];
            var nm30 = this[0] * a[12] + this[4] * a[13] + this[8] * a[14] + this[12] * a[15];
            var nm31 = this[1] * a[12] + this[5] * a[13] + this[9] * a[14] + this[13] * a[15];
            var nm32 = this[2] * a[12] + this[6] * a[13] + this[10] * a[14] + this[14] * a[15];
            var nm33 = this[3] * a[12] + this[7] * a[13] + this[11] * a[14] + this[15] * a[15];
            o[0] = nm00;
            o[1] = nm01;
            o[2] = nm02;
            o[3] = nm03;
            o[4] = nm10;
            o[5] = nm11;
            o[6] = nm12;
            o[7] = nm13;
            o[8] = nm20;
            o[9] = nm21;
            o[10] = nm22;
            o[11] = nm23;
            o[12] = nm30;
            o[13] = nm31;
            o[14] = nm32;
            o[15] = nm33;
            return o;
        },
        transpose: function(o) {
            o = o || this;
            var nm00 = this[0];
            var nm01 = this[4];
            var nm02 = this[8];
            var nm03 = this[12];
            var nm10 = this[1];
            var nm11 = this[5];
            var nm12 = this[9];
            var nm13 = this[13];
            var nm20 = this[2];
            var nm21 = this[6];
            var nm22 = this[10];
            var nm23 = this[14];
            var nm30 = this[3];
            var nm31 = this[7];
            var nm32 = this[11];
            var nm33 = this[15];
            o[0] = nm00;
            o[1] = nm01;
            o[2] = nm02;
            o[3] = nm03;
            o[4] = nm10;
            o[5] = nm11;
            o[6] = nm12;
            o[7] = nm13;
            o[8] = nm20;
            o[9] = nm21;
            o[10] = nm22;
            o[11] = nm23;
            o[12] = nm30;
            o[13] = nm31;
            o[14] = nm32;
            o[15] = nm33;
            return o;
        },
        invert: function(o) {
            o = o || this;
            var a = this[0] * this[5] - this[1] * this[4];
            var b = this[0] * this[6] - this[2] * this[4];
            var c = this[0] * this[7] - this[3] * this[4];
            var d = this[1] * this[6] - this[2] * this[5];
            var e = this[1] * this[7] - this[3] * this[5];
            var f = this[2] * this[7] - this[3] * this[6];
            var g = this[8] * this[13] - this[9] * this[12];
            var h = this[8] * this[14] - this[10] * this[12];
            var i = this[8] * this[15] - this[11] * this[12];
            var j = this[9] * this[14] - this[10] * this[13];
            var k = this[9] * this[15] - this[11] * this[13];
            var l = this[10] * this[15] - this[11] * this[14];
            var det = a * l - b * k + c * j + d * i - e * h + f * g;
            det = 1 / det;
            var nm00 = (this[5] * l - this[6] * k + this[7] * j) * det;
            var nm01 = (-this[1] * l + this[2] * k - this[3] * j) * det;
            var nm02 = (this[13] * f - this[14] * e + this[15] * d) * det;
            var nm03 = (-this[9] * f + this[10] * e - this[11] * d) * det;
            var nm10 = (-this[4] * l + this[6] * i - this[7] * h) * det;
            var nm11 = (this[0] * l - this[2] * i + this[3] * h) * det;
            var nm12 = (-this[12] * f + this[14] * c - this[15] * b) * det;
            var nm13 = (this[8] * f - this[10] * c + this[11] * b) * det;
            var nm20 = (this[4] * k - this[5] * i + this[7] * g) * det;
            var nm21 = (-this[0] * k + this[1] * i - this[3] * g) * det;
            var nm22 = (this[12] * e - this[13] * c + this[15] * a) * det;
            var nm23 = (-this[8] * e + this[9] * c - this[11] * a) * det;
            var nm30 = (-this[4] * j + this[5] * h - this[6] * g) * det;
            var nm31 = (this[0] * j - this[1] * h + this[2] * g) * det;
            var nm32 = (-this[12] * d + this[13] * b - this[14] * a) * det;
            var nm33 = (this[8] * d - this[9] * b + this[10] * a) * det;
            o[0] = nm00;
            o[1] = nm01;
            o[2] = nm02;
            o[3] = nm03;
            o[4] = nm10;
            o[5] = nm11;
            o[6] = nm12;
            o[7] = nm13;
            o[8] = nm20;
            o[9] = nm21;
            o[10] = nm22;
            o[11] = nm23;
            o[12] = nm30;
            o[13] = nm31;
            o[14] = nm32;
            o[15] = nm33;
            return o;
        },
        translateVec3: function(a, o) {
            o = o || this;
            o[12] = this[0] * a[0] + this[4] * a[1] + this[8] * a[2] + this[12];
            o[13] = this[1] * a[0] + this[5] * a[1] + this[9] * a[2] + this[13];
            o[14] = this[2] * a[0] + this[6] * a[1] + this[10] * a[2] + this[14];
            o[15] = this[3] * a[0] + this[7] * a[1] + this[11] * a[2] + this[15];
            return o;
        },
        translateXYZ: function(x, y, z, o) {
            o = o || this;
            o[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
            o[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
            o[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
            o[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
            return o;
        },
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
            var nm00 = this[0] * rm00 + this[4] * rm01 + this[8] * rm02;
            var nm01 = this[1] * rm00 + this[5] * rm01 + this[9] * rm02;
            var nm02 = this[2] * rm00 + this[6] * rm01 + this[10] * rm02;
            var nm03 = this[3] * rm00 + this[7] * rm01 + this[11] * rm02;
            var nm10 = this[0] * rm10 + this[4] * rm11 + this[8] * rm12;
            var nm11 = this[1] * rm10 + this[5] * rm11 + this[9] * rm12;
            var nm12 = this[2] * rm10 + this[6] * rm11 + this[10] * rm12;
            var nm13 = this[3] * rm10 + this[7] * rm11 + this[11] * rm12;
            o[8] = this[0] * rm20 + this[4] * rm21 + this[8] * rm22;
            o[9] = this[1] * rm20 + this[5] * rm21 + this[9] * rm22;
            o[10] = this[2] * rm20 + this[6] * rm21 + this[10] * rm22;
            o[11] = this[3] * rm20 + this[7] * rm21 + this[11] * rm22;
            o[0] = nm00;
            o[1] = nm01;
            o[2] = nm02;
            o[3] = nm03;
            o[4] = nm10;
            o[5] = nm11;
            o[6] = nm12;
            o[7] = nm13;
            o[12] = this[12];
            o[13] = this[13];
            o[14] = this[14];
            o[15] = this[15];
            return o;
        },
        perspective: function(fovy, aspect, near, far, o) {
            o = o || this;
            var h = Math.tan(fovy * .5);
            var rm00 = 1 / (h * aspect);
            var rm11 = 1 / h;
            var rm22;
            var rm32;
            var zZeroToOne = false;
            rm22 = (zZeroToOne ? far : far + near) / (near - far);
            rm32 = (zZeroToOne ? far : far + far) * near / (near - far);
            var nm20 = this[8] * rm22 - this[12];
            var nm21 = this[9] * rm22 - this[13];
            var nm22 = this[10] * rm22 - this[14];
            var nm23 = this[11] * rm22 - this[15];
            o[0] = this[0] * rm00;
            o[1] = this[1] * rm00;
            o[2] = this[2] * rm00;
            o[3] = this[3] * rm00;
            o[4] = this[4] * rm11;
            o[5] = this[5] * rm11;
            o[6] = this[6] * rm11;
            o[7] = this[7] * rm11;
            o[12] = this[8] * rm32;
            o[13] = this[9] * rm32;
            o[14] = this[10] * rm32;
            o[15] = this[11] * rm32;
            o[8] = nm20;
            o[9] = nm21;
            o[10] = nm22;
            o[11] = nm23;
            return o;
        },
        ortho: function(left, right, bottom, top, near, far, o) {
            o = o || this;
            var rm00 = 2 / (right - left);
            var rm11 = 2 / (top - bottom);
            var rm22 = 2 / (near - far);
            var rm30 = (left + right) / (left - right);
            var rm31 = (top + bottom) / (bottom - top);
            var rm32 = (far + near) / (near - far);
            o[12] = this[0] * rm30 + this[4] * rm31 + this[8] * rm32 + this[12];
            o[13] = this[1] * rm30 + this[5] * rm31 + this[9] * rm32 + this[13];
            o[14] = this[2] * rm30 + this[6] * rm31 + this[10] * rm32 + this[14];
            o[15] = this[3] * rm30 + this[7] * rm31 + this[11] * rm32 + this[15];
            o[0] = this[0] * rm00;
            o[1] = this[1] * rm00;
            o[2] = this[2] * rm00;
            o[3] = this[3] * rm00;
            o[4] = this[4] * rm11;
            o[5] = this[5] * rm11;
            o[6] = this[6] * rm11;
            o[7] = this[7] * rm11;
            o[8] = this[8] * rm22;
            o[9] = this[9] * rm22;
            o[10] = this[10] * rm22;
            o[11] = this[11] * rm22;
            return o;
        }
    };
    weml.selectTypeprototype(Mat4);
})();
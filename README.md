# Weml.js - WebGL Math Library

**Weml.js** is JavaScript linear algebra **We**bGL **M**ath **L**ibrary with intuitive syntax, seamless integration with WebGL and (ultra) fast SISD and SIMD implementations.

The syntax were inspired by and most of the math is based on [JOML, the awesome Java OpenGL Math Library](https://github.com/JOML-CI/JOML).

**Please note that weml.js is still kinda work in progress. A lot of arithmetic operations (especially for Matrices) are not added yet and some types (Vec2, Mat3) are even missing entirely.**


## Design

All types in **weml** are based on typed Arrays. That allows seamless integration with WebGL and ultra fast SIMD implementations without
internal conversions.

The syntax were designed to be practical and intuitive, and they are awesome!
Here, check this out:
```
var a = new Vec3(1, 2, 3);
var b = new Vec3();
var c = new Vec3(-5, -5, -5);

a.put(b).mul(c).mulScalar(2).get(c).addXYZ(1,1,1);

console.log(a);
console.log(b);
console.log(c);
```
results in
```
Vec3[-10, -20, 30]
Vec3[1, 2, 3]
Vec3[-9, -19, -29]
```

Pretty cool, eh?

It works because most functions in **weml** follow the following scheme:
```
type.operation(args, target) {
	target = target || this;
	// do some operation with args
	return target.set(_result);
}
```
So, every operation mutates the called type, expect when given an optional target.
Then, the mutated type that holds the result, being either the called object or the optional target, is returned to allow further calculations with the result!


## Documentation
Doesn't really exist yet, sorry


## Vectors
Ah, the good 'ol vectors. Useful for pretty much anything you could immagine.
Creating one in **weml** is as simple as:
```
var a = new Vec3(); // [0, 0, 0]
var b = new Vec3(1, 2, 3) // [1, 2, 3]
```
Simple stuff.

Basic arithmetic operations between Vectors and even between Vectors and Scalars are just as easy!
```
a.add(b.addScalar(2)).addXYZ(1,3,7);
```

**Weml** also supports various a bit more complex operations (including, but not limited to):
```
float dot = a.normalize().dot(b);

var c = new Vec3(0, 1, 0);
var r = a.half(c, new Vec3()).reflect(b);
```


## Quaternions
Quaternions are really great for representing rotations without having to fear the dreaded gimbal lock! \*ghost noises\*
What a coincidence, **weml** also provides Quaternions!

To create one, just do:
```
var qa = new Quat();
var qb = new Quat(0, 0, 0, 3.14159);
```

Quaternions have some really useful rotation functions:
```
qa = new Quat();
var qc = qa.rotateAroundAxisXYZ(0, 1, 0, 0.1, new Quat()).rotateLocalXYZ(-0.3, 0, 0);

var a = qc.transformVec3(c.clone().normalize()).mulScalar(1.41);
```


## Matrices
Matrices – just like Quaternions; great for rotations, but also for many other transforms!
Especially 4x4 matricies are used lots in games: Model Matrix, Projection Matrix, View Matrix, Normal Matrix, you get the idea.

```
var ma = new Mat4();
var mb = ma.clone();
```

They also have some nice functions to deal with transformations:
```
ma.applyRotationQuat(qa, mb.identity()).translateXYZ(0, 2, 0);
```


## License

**Weml.js** is licensed under [MIT](https://choosealicense.com/licenses/mit/) so do whatever you want with it!


Except that. Don't be weird...
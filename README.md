# Weml.js - WebGL Math Library

**Weml.js** is JavaScript linear algebra **We**bGL **M**ath **L**ibrary with intuitive syntax, seamless integration with WebGL and (ultra) fast SISD and SIMD implementations.

The syntax were inspired by and most of the math is based on [JOML, the awesome Java OpenGL Math Library](https://github.com/JOML-CI/JOML).


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

## Vectors


## Quaternions


## Matrices



## License

**Weml.js** is licensed under [MIT](https://choosealicense.com/licenses/mit/) so do whatever you want with it!


Except that. Don't be weird...
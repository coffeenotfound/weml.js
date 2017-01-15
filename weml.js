
var weml = {
	allocateArray: function(size) {
		return new Float32Array(size);
	},
	
	selectTypeprototype: function(clazz) {
		const hasSIMD = window.SIMD !== undefined;
		clazz.typeprototype._current = (hasSIMD ? clazz.typeprototype.simd : null) || clazz.typeprototype.sisd;
	},
};
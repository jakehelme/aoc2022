const fs = require('fs');
const raw = fs.readFileSync('./d13.txt', 'utf8');

const packetPairs = raw
	.split('\n\n')
	.map((p) => p.split('\n').map((x) => eval(x)));

const notArray = (array) => !Array.isArray(array);
const isArray = (array) => Array.isArray(array);

function areOrdered([left, right]) {
	if (!left.length && !right.length) {
		return null;
	} else if (!left.length) return true;
	else if (!right.length) return false;

	for (let i = 0; i < left.length; i++) {
		if (notArray(left[i]) && notArray(right[i])) {
			if (left[i] > right[i]) return false;
			else if (left[i] < right[i]) return true;
		} else if (isArray(left[i]) && isArray(right[i])) {
			const result = areOrdered([left[i], right[i]]);
			if (result !== null) return result;
		} else if (isArray(left[i])) {
			const result = areOrdered([left[i], [right[i]]]);
			if (result !== null) return result;
		} else if (isArray(right[i])) {
			const result = areOrdered([[left[i]], right[i]]);
			if (result !== null) return result;
		}

		if (i === left.length - 1 && right.length > left.length) {
			return true;
		} else if (i === right.length - 1 && left.length > right.length) {
			return false;
		}
	}
	return null;
}

const orderedPairs = [];

packetPairs.forEach((pair, i) => {
	if (areOrdered(pair)) orderedPairs.push(i + 1);
});

console.log(orderedPairs.reduce((a, i) => a + i, 0));

const allPackets = packetPairs.flat();
allPackets.push([[2]]);
allPackets.push([[6]]);

allPackets.sort((a, b) => {
	const result = areOrdered([a, b]);
	return result ? -1 : 0;
});

const markerIndices = [];

allPackets.forEach((x, i) => {
	if (
		x.length === 1 &&
		Array.isArray(x[0]) &&
		x[0].length === 1 &&
		(x[0][0] === 2 || x[0][0] === 6)
	)
		markerIndices.push(i + 1);
});

console.log(markerIndices.reduce((a, i) => a * i, 1));

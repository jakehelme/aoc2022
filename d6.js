const fs = require('fs');
const raw = fs.readFileSync('./d6.txt', 'utf8');

for (let i = 0; i < raw.length - 4; i++) {
	const test = new Set();
	for (let j = i; j < i + 4; j++) {
		test.add(raw[j]);
	}
	if (test.size === 4) {
		console.log(i + 4);
		break;
	}
}

for (let i = 0; i < raw.length - 14; i++) {
	const test = new Set();
	for (let j = i; j < i + 14; j++) {
		test.add(raw[j]);
	}
	if (test.size === 14) {
		console.log(i + 14);
		break;
	}
}

const fs = require('fs');
const raw = fs.readFileSync('./d10.txt', 'utf8');

const instructions = raw
	.split('\n')
	.map((x) => x.split(' ').map((y, i) => (i ? Number(y) : y)));

let X = 1;
let cycles = 0;
let signalStrengths = [];

for (const instruction of instructions) {
	const [inst, val] = instruction;
	const cycleLength = inst === 'addx' ? 2 : 1;

	for (let i = 0; i < cycleLength; i++) {
		cycles++;
		switch (cycles) {
			case 20:
			case 60:
			case 100:
			case 140:
			case 180:
			case 220:
				signalStrengths.push(cycles * X);
				break;
			default:
				break;
		}
	}

	if (val) X += val;
}

console.log(signalStrengths.reduce((tot, s) => tot + s));

cycles = 0;
X = 1;

const crt = [];
for (let i = 0; i < 6; i++) {
	crt.push(Array.from({ length: 40 }, () => '.'));
}

function crtPosFromCycle(cycle) {
	const row = Math.floor((cycle - 1) / 40);
	const col = (cycle - 1) % 40;
	return [row, col];
}

for (const instruction of instructions) {
	const [inst, val] = instruction;
	const cycleLength = inst === 'addx' ? 2 : 1;

	for (let i = 0; i < cycleLength; i++) {
		cycles++;
		if (cycles % 40 <= X + 2 && cycles % 40 >= X) {
			const [row, col] = crtPosFromCycle(cycles);
			crt[row][col] = '#';
		}
	}

	if (val) X += val;
}

crt.forEach((row) => console.log(row.join('')));

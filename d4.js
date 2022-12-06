const fs = require('fs');
const raw = fs.readFileSync('./d4.txt', 'utf8');

const pairRanges = raw
	.split('\n')
	.map((x) => x.split(',').map((y) => y.split('-').map(Number)));
let contained = 0;

pairRanges.forEach((pair) => {
	const [elf1, elf2] = pair;
	if (
		(elf1[0] <= elf2[0] && elf1[1] >= elf2[1]) ||
		(elf2[0] <= elf1[0] && elf2[1] >= elf1[1])
	) {
		contained++;
	}
});

console.log(contained);

let overlaps = 0;

pairRanges.forEach((pair) => {
	const [elf1, elf2] = pair;
	const elf1Arr = Array.from(
		new Array(elf1[1] - elf1[0] + 1),
		(_, i) => i + elf1[0]
	);
	const elf2Arr = Array.from(
		new Array(elf2[1] - elf2[0] + 1),
		(_, i) => i + elf2[0]
	);
	const overlapped = elf1Arr.filter((x) => elf2Arr.includes(x));
	if (overlapped.length) overlaps++;
});

console.log(overlaps);

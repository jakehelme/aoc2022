const fs = require('fs');
const raw = fs.readFileSync('./d1.txt', 'utf8');

const elfCounts = raw.split('\n\n').map((x) => x.split('\n').map(Number));
let highest = 0;
const elfTots = [];

elfCounts.forEach((elf) => {
	let elfTot = 0;
	elf.forEach((item) => {
		elfTot += item;
	});
	elfTots.push(elfTot);
	if (elfTot > highest) highest = elfTot;
});

console.log(highest);

elfTots.sort((a, b) => b - a);

console.log(elfTots[0] + elfTots[1] + elfTots[2]);

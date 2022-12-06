const fs = require('fs');
const raw = fs.readFileSync('./d3.txt', 'utf8');

const rucksackContents = raw.split('\n');
let prioTot = 0;

rucksackContents.forEach((rucksack) => {
	const coms = split(rucksack);

	for (const item of coms[0]) {
		if (coms[1].indexOf(item) >= 0) {
			const prio = convertToPriority(item);
			prioTot += prio;
			break;
		}
	}
});

function split(contents) {
	const com1 = contents.substr(0, contents.length / 2);
	const com2 = contents.substr(contents.length / 2, contents.length / 2);
	return [com1, com2];
}

function convertToPriority(item) {
	const charCode = item.charCodeAt();
	return charCode >= 97 ? charCode - 96 : charCode - 38;
}

console.log(prioTot);

let badgePrioTot = 0;
for (let i = 0; i < rucksackContents.length; i += 3) {
	for (const item of rucksackContents[i]) {
		if (
			rucksackContents[i + 1].indexOf(item) >= 0 &&
			rucksackContents[i + 2].indexOf(item) >= 0
		) {
			const prio = convertToPriority(item);
			badgePrioTot += prio;
			break;
		}
	}
}

console.log(badgePrioTot);

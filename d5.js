const fs = require('fs');
const raw = fs.readFileSync('./d5.txt', 'utf8');

const [rawContainers, rawMoves] = raw.split('\n\n').map((x) => x.split('\n'));

function buildArray() {
	const containers = [];
	const containerStackCount = (rawContainers[0].length + 1) / 4;

	for (let i = 0; i < containerStackCount; i++) {
		containers.push([]);
	}

	for (let i = rawContainers.length - 2; i >= 0; i--) {
		const row = rawContainers[i];
		let stackIndex = 0;
		for (let j = 1; j < row.length; j += 4) {
			if (row[j] !== ' ') containers[stackIndex].push(row[j]);
			stackIndex++;
		}
	}
	return containers;
}

let containers = buildArray();

rawMoves.forEach((move) => {
	const [count, start, end] = move.match(/\d+/g).map(Number);
	for (let i = 0; i < count; i++) {
		const moving = containers[start - 1].pop();
		containers[end - 1].push(moving);
	}
});

console.log(containers.reduce((acc, x) => (acc += x[x.length - 1]), ''));

containers = buildArray();

rawMoves.forEach((move) => {
	const [count, start, end] = move.match(/\d+/g).map(Number);
	const moving = containers[start - 1].splice(
		containers[start - 1].length - count,
		count
	);
	containers[end - 1].push(...moving);
});

console.log(containers.reduce((acc, x) => (acc += x[x.length - 1]), ''));

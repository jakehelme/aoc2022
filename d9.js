const fs = require('fs');
const raw = fs.readFileSync('./d9.txt', 'utf8');

const moves = raw
	.split('\n')
	.map((x) => x.split(' '))
	.map((y) => [y[0], Number(y[1])]);

const rWidth = moves
	.filter((x) => x[0] === 'R')
	.reduce((tot, x) => tot + x[1], 0);
const uWidth = moves
	.filter((x) => x[0] === 'U')
	.reduce((tot, x) => tot + x[1], 0);
const lWidth = moves
	.filter((x) => x[0] === 'L')
	.reduce((tot, x) => tot + x[1], 0);
const dWidth = moves
	.filter((x) => x[0] === 'D')
	.reduce((tot, x) => tot + x[1], 0);

const gridWidth = rWidth + lWidth + 2;
const gridHeight = uWidth + dWidth + 2;

const grid = [];

for (let y = 0; y < gridHeight; y++) {
	grid.push([]);
	for (let x = 0; x < gridWidth; x++) {
		grid[y].push('.');
	}
}

const headPos = [Math.ceil(gridHeight / 2), Math.ceil(gridWidth / 2)];
const tailPos = [Math.ceil(gridHeight / 2), Math.ceil(gridWidth / 2)];

function tailIsAdjacent() {
	return (
		tailPos[0] >= headPos[0] - 1 &&
		tailPos[0] <= headPos[0] + 1 &&
		tailPos[1] >= headPos[1] - 1 &&
		tailPos[1] <= headPos[1] + 1
	);
}

for (const move of moves) {
	const [dir, dist] = move;
	for (let i = 0; i < dist; i++) {
		switch (dir) {
			case 'R':
				headPos[1] = headPos[1] + 1;
				if (!tailIsAdjacent()) {
					tailPos[1] = tailPos[1] + 1;
					if (headPos[0] !== tailPos[0]) tailPos[0] = headPos[0];
				}
				break;
			case 'D':
				headPos[0] = headPos[0] + 1;
				if (!tailIsAdjacent()) {
					tailPos[0] = tailPos[0] + 1;
					if (headPos[1] !== tailPos[1]) tailPos[1] = headPos[1];
				}
				break;
			case 'L':
				headPos[1] = headPos[1] - 1;
				if (!tailIsAdjacent()) {
					tailPos[1] = tailPos[1] - 1;
					if (headPos[0] !== tailPos[0]) tailPos[0] = headPos[0];
				}
				break;
			case 'U':
				headPos[0] = headPos[0] - 1;
				if (!tailIsAdjacent()) {
					tailPos[0] = tailPos[0] - 1;
					if (headPos[1] !== tailPos[1]) tailPos[1] = headPos[1];
				}
				break;
			default:
				throw new Error('nope');
		}
		grid[tailPos[0]][tailPos[1]] = '#';
	}
}

const result = grid.map(x => x.join('')).join('').split('').filter(x => x === '#').length;

console.log(result);

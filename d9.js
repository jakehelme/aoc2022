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

function generateGrid() {
	const grid = [];
	for (let y = 0; y < gridHeight; y++) {
		grid.push([]);
		for (let x = 0; x < gridWidth; x++) {
			grid[y].push('.');
		}
	}
	return grid;
}

let grid = generateGrid();

let headPos = [Math.ceil(gridHeight / 2), Math.ceil(gridWidth / 2)];
const tailPos = [Math.ceil(gridHeight / 2), Math.ceil(gridWidth / 2)];

function knotsAreAdjacent(leadKnot, trailingKnot) {
	return (
		trailingKnot[0] >= leadKnot[0] - 1 &&
		trailingKnot[0] <= leadKnot[0] + 1 &&
		trailingKnot[1] >= leadKnot[1] - 1 &&
		trailingKnot[1] <= leadKnot[1] + 1
	);
}

for (const move of moves) {
	const [dir, dist] = move;
	for (let i = 0; i < dist; i++) {
		switch (dir) {
			case 'R':
				headPos[1] = headPos[1] + 1;
				if (!knotsAreAdjacent(headPos, tailPos)) {
					tailPos[1] = tailPos[1] + 1;
					if (headPos[0] !== tailPos[0]) tailPos[0] = headPos[0];
				}
				break;
			case 'D':
				headPos[0] = headPos[0] + 1;
				if (!knotsAreAdjacent(headPos, tailPos)) {
					tailPos[0] = tailPos[0] + 1;
					if (headPos[1] !== tailPos[1]) tailPos[1] = headPos[1];
				}
				break;
			case 'L':
				headPos[1] = headPos[1] - 1;
				if (!knotsAreAdjacent(headPos, tailPos)) {
					tailPos[1] = tailPos[1] - 1;
					if (headPos[0] !== tailPos[0]) tailPos[0] = headPos[0];
				}
				break;
			case 'U':
				headPos[0] = headPos[0] - 1;
				if (!knotsAreAdjacent(headPos, tailPos)) {
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

console.log(
	grid
		.map((x) => x.join(''))
		.join('')
		.split('')
		.filter((x) => x === '#').length
);

grid = generateGrid();

const knots = [];
for (let i = 0; i < 10; i++) {
	knots.push([Math.ceil(gridHeight / 2), Math.ceil(gridWidth / 2)]);
}

for (const move of moves) {
	const [dir, dist] = move;
	for (let i = 0; i < dist; i++) {
		switch (dir) {
			case 'R':
				knots[0][1] = knots[0][1] + 1;
				for (let i = 1; i < knots.length; i++) {
					if (!knotsAreAdjacent(knots[i - 1], knots[i])) {
						if (knots[i - 1][1] > knots[i][1]) {
							knots[i][1] = knots[i][1] + 1;
						} else if (knots[i - 1][1] < knots[i][1]) {
							knots[i][1] = knots[i][1] - 1;
						}

						if (knots[i - 1][0] > knots[i][0]) {
							knots[i][0] = knots[i][0] + 1;
						} else if (knots[i - 1][0] < knots[i][0]) {
							knots[i][0] = knots[i][0] - 1;
						}
					}
				}

				break;
			case 'D':
				knots[0][0] = knots[0][0] + 1;
				for (let i = 1; i < knots.length; i++) {
					if (!knotsAreAdjacent(knots[i - 1], knots[i])) {
						if (knots[i - 1][0] > knots[i][0]) {
							knots[i][0] = knots[i][0] + 1;
						} else if (knots[i - 1][0] < knots[i][0]) {
							knots[i][0] = knots[i][0] - 1;
						}

						if (knots[i - 1][1] > knots[i][1]) {
							knots[i][1] = knots[i][1] + 1;
						} else if (knots[i - 1][1] < knots[i][1]) {
							knots[i][1] = knots[i][1] - 1;
						}
					}
				}
				break;
			case 'L':
				knots[0][1] = knots[0][1] - 1;
				for (let i = 1; i < knots.length; i++) {
					if (!knotsAreAdjacent(knots[i - 1], knots[i])) {
						if (knots[i - 1][1] > knots[i][1]) {
							knots[i][1] = knots[i][1] + 1;
						} else if (knots[i - 1][1] < knots[i][1]) {
							knots[i][1] = knots[i][1] - 1;
						}

						if (knots[i - 1][0] > knots[i][0]) {
							knots[i][0] = knots[i][0] + 1;
						} else if (knots[i - 1][0] < knots[i][0]) {
							knots[i][0] = knots[i][0] - 1;
						}
					}
				}
				break;
			case 'U':
				knots[0][0] = knots[0][0] - 1;
				for (let i = 1; i < knots.length; i++) {
					if (!knotsAreAdjacent(knots[i - 1], knots[i])) {
						if (knots[i - 1][0] > knots[i][0]) {
							knots[i][0] = knots[i][0] + 1;
						} else if (knots[i - 1][0] < knots[i][0]) {
							knots[i][0] = knots[i][0] - 1;
						}

						if (knots[i - 1][1] > knots[i][1]) {
							knots[i][1] = knots[i][1] + 1;
						} else if (knots[i - 1][1] < knots[i][1]) {
							knots[i][1] = knots[i][1] - 1;
						}
					}
				}
				break;
			default:
				throw new Error('nope');
		}

		grid[knots[9][0]][knots[9][1]] = '#';
	}
}

console.log(
	grid
		.map((x) => x.join(''))
		.join('')
		.split('')
		.filter((x) => x === '#').length
);

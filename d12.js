const fs = require('fs');
const raw = fs.readFileSync('./d12.txt', 'utf8');

const grid = [];
raw.split('\n').forEach((row) => {
	grid.push(row.split(''));
});

let start;
let end;

for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		if (grid[y][x] === 'S') {
			start = `${y},${x}`;
			grid[y][x] = 'a';
		} else if (grid[y][x] === 'E') {
			end = `${y},${x}`;
			grid[y][x] = 'z';
		}
	}
}

function getShortestPath(startingPoint) {
	const frontier = [];
	frontier.push(startingPoint);

	const cameFrom = {};
	cameFrom[startingPoint] = null;

	while (frontier.length > 0) {
		const current = frontier.shift();
		if (current === end) break;
		const [y, x] = current.split(',').map(Number);
		const neighbours = getNeighbours(y, x);
		neighbours.forEach((n) => {
			const strPos = `${n[0]},${n[1]}`;
			if (cameFrom[strPos] === undefined) {
				frontier.push(strPos);
				cameFrom[strPos] = current;
			}
		});
	}

	let pointer = end;
	const path = [];
	while (pointer !== startingPoint) {
		path.push(pointer);
		if (cameFrom[pointer]) pointer = cameFrom[pointer];
		else return Infinity;
	}

	return path.length;
}

function getNeighbours(y, x) {
	const neighbours = [];
	if (y > 0) neighbours.push([y - 1, x]);
	if (y < grid.length - 1) neighbours.push([y + 1, x]);
	if (x > 0) neighbours.push([y, x - 1]);
	if (x < grid[0].length - 1) neighbours.push([y, x + 1]);
	return neighbours.filter(
		(n) => grid[n[0]][n[1]].charCodeAt() - grid[y][x].charCodeAt() < 2
	);
}

console.log(getShortestPath(start));

const potentialStartingPoints = [];
for (let y = 0; y < grid.length; y++) {
	for (let x = 0; x < grid[0].length; x++) {
		if (grid[y][x] === 'a') {
			potentialStartingPoints.push(`${y},${x}`);
		}
	}
}

let minPath = Infinity;
for (const starting of potentialStartingPoints) {
	const result = getShortestPath(starting);
	if (result < minPath) minPath = result;
}

console.log(minPath);

const fs = require('fs');
const raw = fs.readFileSync('./d18.txt', 'utf8');

const cubes = raw.split('\n').map((x) => x.split(',').map(Number));

let max = [0, 0, 0];

const neighbourMappings = [
	[1, 0, 0],
	[-1, 0, 0],
	[0, 1, 0],
	[0, -1, 0],
	[0, 0, 1],
	[0, 0, -1],
];

for (const cube of cubes) {
	max = max.map((c, i) => Math.max(c, cube[i]));
}

const grid = [];
for (let x = 0; x < max[0] + 6; x++) {
	grid.push([]);
	for (let y = 0; y < max[1] + 6; y++) {
		grid[x].push([]);
		for (let z = 0; z < max[2] + 6; z++) {
			grid[x][y][z] = '.';
		}
	}
}

for (const cube of cubes) {
	const [x, y, z] = cube;
	grid[x + 3][y + 3][z + 3] = '#'; //offset to handle blocks on fringe
}

let surfaces = 0;
for (let x = 0; x < grid.length; x++) {
	for (let y = 0; y < grid[x].length; y++) {
		for (let z = 0; z < grid[x][y].length; z++) {
			const block = grid[x][y][z];
			if (block === '#') {
				if (x - 1 < 0 || grid[x - 1][y][z] !== '#') surfaces++;
				if (x + 1 === grid.length || grid[x + 1][y][z] !== '#') surfaces++;
				if (y - 1 < 0 || grid[x][y - 1][z] !== '#') surfaces++;
				if (y + 1 === grid[x].length || grid[x][y + 1][z] !== '#') surfaces++;
				if (z - 1 < 0 || grid[x][y][z - 1] !== '#') surfaces++;
				if (z + 1 === grid[x][y].length || grid[x][y][z + 1] !== '#')
					surfaces++;
			}
		}
	}
}

console.log(surfaces);

function getAdjacentOpenSpaces(pos) {
	const [x, y, z] = pos;
	const neighbours = [];
	for (const mapping of neighbourMappings) {
		if (
			x + mapping[0] >= 0 &&
			y + mapping[1] >= 0 &&
			z + mapping[2] >= 0 &&
			x + mapping[0] < grid.length &&
			y + mapping[1] < grid[0].length &&
			z + mapping[2] < grid[0][0].length &&
			grid[x + mapping[0]][y + mapping[1]][z + mapping[2]] !== '#'
		) {
			neighbours.push([x + mapping[0], y + mapping[1], z + mapping[2]]);
		}
	}
	return neighbours;
}

function countExternalSurfaces(pos) {
	const surfaces = getAdjacentOpenSpaces(pos);
	let externalSurfaces = 0;
	for (const surface of surfaces) {
		const frontier = [surface];
		const reached = new Set();
		reached.add(`${pos[0]},${pos[1]},${pos[2]}`);

		while (frontier.length) {
			const current = frontier.pop();

			if (
				current[0] === 0 ||
				current[0] === grid.length - 1 ||
				current[1] === 0 ||
				current[1] === grid[0].length - 1 ||
				current[2] === 0 ||
				current[2] === grid[0][0].length - 1
			) {
				externalSurfaces++;
				break;
			}

			const neighbours = getAdjacentOpenSpaces(current);
			for (const neighbour of neighbours) {
				const key = `${neighbour[0]},${neighbour[1]},${neighbour[2]}`;
				if (!reached.has(key)) {
					frontier.push([neighbour[0], neighbour[1], neighbour[2]]);
					reached.add(key);
				}
			}
		}
	}

	return externalSurfaces;
}

const start = performance.now();
let totalExternalSurfaces = 0;
for (let x = 0; x < grid.length; x++) {
	for (let y = 0; y < grid[0].length; y++) {
		for (let z = 0; z < grid[0][0].length; z++) {
			const block = grid[x][y][z];
			if (block === '#') {
				totalExternalSurfaces += countExternalSurfaces([x, y, z]);
			}
		}
	}
}

console.log(totalExternalSurfaces);

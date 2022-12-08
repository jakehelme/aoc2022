const fs = require('fs');
const raw = fs.readFileSync('./d8.txt', 'utf8');

const grid = [];
raw.split('\n').forEach((row) => {
	const gridRow = row.split('').map(Number);
	grid.push(gridRow);
});

let visibleTrees = 0;

for (let y = 1; y < grid.length - 1; y++) {
	tree: for (let x = 1; x < grid[y].length - 1; x++) {
		const treeHeight = grid[y][x];
		// up
		for (let i = y - 1; i >= 0; i--) {
			if (grid[i][x] >= treeHeight) {
				break;
			}
			if (i === 0) {
				visibleTrees++;
				continue tree;
			}
		}
		// right
		for (let i = x + 1; i < grid[y].length; i++) {
			if (grid[y][i] >= treeHeight) {
				break;
			}
			if (i === grid[y].length - 1) {
				visibleTrees++;
				continue tree;
			}
		}
		// down
		for (let i = y + 1; i < grid.length; i++) {
			if (grid[i][x] >= treeHeight) {
				break;
			}
			if (i === grid.length - 1) {
				visibleTrees++;
				continue tree;
			}
		}
		// left
		for (let i = x - 1; i >= 0; i--) {
			if (grid[y][i] >= treeHeight) {
				break;
			}
			if (i === 0) {
				visibleTrees++;
				continue tree;
			}
		}
	}
}

visibleTrees += 2 * grid[0].length + 2 * (grid.length - 2);

console.log(visibleTrees);

const scenicScores = [];

for (let y = 1; y < grid.length - 1; y++) {
	for (let x = 1; x < grid[y].length - 1; x++) {
		const treeHeight = grid[y][x];
		let scenicScore = 1;
		// up
		for (let i = y - 1; i >= 0; i--) {
			if (grid[i][x] >= treeHeight) {
				scenicScore *= y - i;
				break;
			}
			if (i === 0) {
				scenicScore *= y - i;
			}
		}
		// right
		for (let i = x + 1; i < grid[y].length; i++) {
			if (grid[y][i] >= treeHeight) {
				scenicScore *= i - x;
				break;
			}
			if (i === grid[y].length - 1) {
				scenicScore *= i - x;
			}
		}
		// down
		for (let i = y + 1; i < grid.length; i++) {
			if (grid[i][x] >= treeHeight) {
				scenicScore *= i - y;
				break;
			}
			if (i === grid.length - 1) {
				scenicScore *= i - y;
			}
		}
		// left
		for (let i = x - 1; i >= 0; i--) {
			if (grid[y][i] >= treeHeight) {
				scenicScore *= x - i;
				break;
			}
			if (i === 0) {
				scenicScore *= x - i;
			}
		}
		scenicScores.push(scenicScore);
	}
}

console.log(scenicScores.sort((a, b) => b - a)[0]);

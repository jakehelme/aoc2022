const fs = require('fs');
const raw = fs.readFileSync('./d14.txt', 'utf8');

const floorWidth = 1000;

const rockSeams = raw.split('\n').map((s) =>
	s
		.split(' -> ')
		.map((c) => c.split(',').map(Number))
		.map((x) => [x[1], x[0]])
);

function generateGrid(addFloor = false) {
	const maxDepth = rockSeams.reduce((a, seamPoints) => {
		const seamMax = seamPoints.reduce((b, point) => 
			point[0] > b ? point[0] : b, 0);
		return seamMax > a ? seamMax : a;
	}, 0) + 1;

	const g = [];
	for(let i = 0; i < maxDepth; i++) {
		g.push('.'.repeat(floorWidth).split(''));
	}

	rockSeams.forEach(seam => {
		for(let i = 1; i < seam.length; i++) {
			const point1 = seam[i - 1];
			const point2 = seam[i];
			if(point1[0] === point2[0]) {
				const max = Math.max(point1[1], point2[1]);
				const min = Math.min(point1[1], point2[1]);
				for(let x = min; x < max + 1; x++) {
					g[point1[0]][x] = '#';
				}
			} else {
				const max = Math.max(point1[0], point2[0]);
				const min = Math.min(point1[0], point2[0]);
				for(let y = min; y < max + 1; y++) {
					g[y][point1[1]] = '#';
				}
			}
		}
	});

	if(addFloor) {
		g.push('.'.repeat(floorWidth).split(''));
		g.push('#'.repeat(floorWidth).split(''));
	}

	return g;
}

function printGridToFile() {
	let out = ''
	for (const row of grid) {
		out += row.join('') + '\n';
	}
	fs.writeFileSync('./out14.txt', out);
}

let grid = generateGrid();
let settled = 0;

main: while(true) {
	let sandGrainPos = [0, 500];
	while(true) {
		if(sandGrainPos[0] === grid.length - 1) break main;
		else if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1]])) sandGrainPos[0] += 1;
		else if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1] - 1])) sandGrainPos = [sandGrainPos[0] + 1, sandGrainPos[1] - 1];
		else if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1] + 1])) sandGrainPos = [sandGrainPos[0] + 1, sandGrainPos[1] + 1];
		else {
			grid[sandGrainPos[0]][sandGrainPos[1]] = 'o';
			settled++;
			break;
		}
	}
}

console.log(settled);

grid = generateGrid(true);
settled = 0;

main: while(true) {
	let sandGrainPos = [0, 500];
	while(true) {
		if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1]])) sandGrainPos[0] += 1;
		else if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1] - 1])) sandGrainPos = [sandGrainPos[0] + 1, sandGrainPos[1] - 1];
		else if(!/[#o]/.test(grid[sandGrainPos[0] + 1][sandGrainPos[1] + 1])) sandGrainPos = [sandGrainPos[0] + 1, sandGrainPos[1] + 1];
		else {
			grid[sandGrainPos[0]][sandGrainPos[1]] = 'o';
			settled++;
			if(sandGrainPos[0] === 0 && sandGrainPos[1] === 500) break main;
			break;
		}
		
	}
}

printGridToFile();
console.log(settled);

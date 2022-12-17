const fs = require('fs');
const raw = fs.readFileSync('./d17.txt', 'utf8');

let rocksToFall = 2022;
const chamberWidth = 7;

// Yuk, there must be a better way to do this
const shapes = [
	{
		height: 1,
		width: 4,
		rightEdges: [[0, 3]],
		leftEdges: [[0, 0]],
		bottomEdges: [
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3],
		],
		topEdges: [
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3],
		],
	},
	{
		height: 3,
		width: 3,
		rightEdges: [
			[0, 1],
			[1, 2],
			[2, 1],
		],
		leftEdges: [
			[0, 1],
			[1, 0],
			[2, 1],
		],
		bottomEdges: [
			[1, 0],
			[2, 1],
			[1, 2],
		],
		topEdges: [
			[1, 0],
			[0, 1],
			[1, 2],
		],
	},
	{
		height: 3,
		width: 3,
		rightEdges: [
			[0, 2],
			[1, 2],
			[2, 2],
		],
		leftEdges: [
			[0, 2],
			[1, 2],
			[2, 0],
		],
		bottomEdges: [
			[2, 0],
			[2, 1],
			[2, 2],
		],
		topEdges: [
			[2, 0],
			[2, 1],
			[0, 2],
		],
	},
	{
		height: 4,
		width: 1,
		rightEdges: [
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0],
		],
		leftEdges: [
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0],
		],
		bottomEdges: [[3, 0]],
		topEdges: [[0, 0]],
	},
	{
		height: 2,
		width: 2,
		rightEdges: [
			[0, 1],
			[1, 1],
		],
		leftEdges: [
			[0, 0],
			[1, 0],
		],
		bottomEdges: [
			[1, 0],
			[1, 1],
		],
		topEdges: [
			[0, 0],
			[0, 1],
		],
	},
];

const jets = raw.split('');

function printChamber() {
	if (fs.existsSync('./out17.txt')) fs.rmSync('./out17.txt');
	for (let i = chamber.length - 1; i >= 0; i--)
		fs.appendFileSync('./out17.txt', `|${chamber[i].join('')}|\n`);
	fs.appendFileSync('./out17.txt', '+-------+');
}

const getEdgePos = (pos, edge) => [pos[0] - edge[0], pos[1] + edge[1]];

function shiftRight(shape, pos) {
	for (const edge of shapes[shape].rightEdges) {
		const edgePos = getEdgePos(pos, edge);
		if (
			edgePos[1] === chamberWidth - 1 ||
			chamber[edgePos[0]][edgePos[1] + 1] === '#'
		)
			return pos;
	}
	for (const edge of shapes[shape].rightEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0]][edgePos[1] + 1] = '@';
	}
	for (const edge of shapes[shape].leftEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0]][edgePos[1]] = '.';
	}
	return [pos[0], pos[1] + 1];
}

function shiftLeft(shape, pos) {
	for (const edge of shapes[shape].leftEdges) {
		const edgePos = getEdgePos(pos, edge);
		if (edgePos[1] === 0 || chamber[edgePos[0]][edgePos[1] - 1] === '#')
			return pos;
	}
	for (const edge of shapes[shape].leftEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0]][edgePos[1] - 1] = '@';
	}
	for (const edge of shapes[shape].rightEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0]][edgePos[1]] = '.';
	}
	return [pos[0], pos[1] - 1];
}

function shiftDown(shape, pos) {
	for (const edge of shapes[shape].bottomEdges) {
		const edgePos = getEdgePos(pos, edge);
		if (edgePos[0] === 0 || chamber[edgePos[0] - 1][edgePos[1]] === '#')
			return false;
	}
	for (const edge of shapes[shape].bottomEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0] - 1][edgePos[1]] = '@';
	}
	for (const edge of shapes[shape].topEdges) {
		const edgePos = getEdgePos(pos, edge);
		chamber[edgePos[0]][edgePos[1]] = '.';
	}
	return true;
}

function dropRock(shapeIndex) {
	let newRows = 0;
	if (chamber.length < 3) {
		newRows = 3 - chamber.length;
	} else {
		let emptyRows = 0;
		while (
			chamber[chamber.length - emptyRows - 1].join('') ===
			'.'.repeat(chamberWidth)
		) {
			emptyRows++;
		}
		if (emptyRows > 3) for (let i = 0; i < emptyRows - 3; i++) chamber.pop();
		else newRows = 3 - emptyRows;
	}
	for (let i = 0; i < newRows; i++) {
		chamber.push(Array.from({ length: chamberWidth }, () => '.'));
	}

	switch (shapeIndex) {
		case 0:
			chamber.push('..@@@@.'.split(''));
			break;
		case 1:
			chamber.push('...@...'.split(''));
			chamber.push('..@@@..'.split(''));
			chamber.push('...@...'.split(''));
			break;
		case 2:
			chamber.push('..@@@..'.split(''));
			chamber.push('....@..'.split(''));
			chamber.push('....@..'.split(''));
			break;
		case 3:
			chamber.push('..@....'.split(''));
			chamber.push('..@....'.split(''));
			chamber.push('..@....'.split(''));
			chamber.push('..@....'.split(''));
			break;
		case 4:
			chamber.push('..@@...'.split(''));
			chamber.push('..@@...'.split(''));
			break;
	}

	let pos = [chamber.length - 1, 2];

	let atRest = false;
	while (!atRest) {
		jets[jetIndex % jets.length] === '>'
			? (pos = shiftRight(shapeIndex, pos))
			: (pos = shiftLeft(shapeIndex, pos));
		jetIndex++;
		atRest = !shiftDown(shapeIndex, pos);
		if (!atRest) {
			pos[0] = pos[0] - 1;
			continue;
		}
		for (let y = pos[0]; y > pos[0] - shapes[shapeIndex].height; y--) {
			for (let x = 0; x < chamberWidth; x++) {
				if (chamber[y][x] === '@') chamber[y][x] = '#';
			}
		}
	}
}

function getHeight() {
	let i = 0;
	while (
		chamber[chamber.length - i - 1].join('') === '.'.repeat(chamberWidth)
	) {
		i++;
	}
	return chamber.length - i;
}

let jetIndex = 0;
let chamber = [];

for (let r = 0; r < rocksToFall; r++) {
	dropRock(r % 5);
}

printChamber();

console.log(getHeight());

// how many consecutive rows need to match ones further on to satisfy us that its repeating, turns out it's quite a few!
// this can probably be calculated in a different way using the length of the input? I couldn't figure it out...
const tunedCheckAhead = 12;
let repeatEnd;
let repeatStart;

search: for (let i = 0; i < chamber.length - 1; i++) {
	for (let j = i + 1; j < chamber.length; j++) {
		if (chamber[i].join('') === chamber[j].join('')) {
			for (let k = 0; k < tunedCheckAhead; k++) {
				if (chamber[i + k].join('') !== chamber[j + k].join('')) break;
				if (k === tunedCheckAhead - 1) {
					repeatEnd = j;
					repeatStart = i;
					break search;
				}
			}
		}
	}
}

jetIndex = 0;
chamber = [];

let rocksToStartRepeat;
let repeatRocks;

for (let i = 0; true; i++) {
	dropRock(i % 5);
	const height = getHeight();
	if (height === repeatStart) {
		rocksToStartRepeat = i + 1;
	} else if (height === repeatEnd) {
		repeatRocks = i - rocksToStartRepeat + 1;
	} else if (height > repeatEnd) {
		break;
	}
}

rocksToFall = 1000000000000;

const repeats = Math.floor((rocksToFall - rocksToStartRepeat) / repeatRocks);
const extraRocks = (rocksToFall - rocksToStartRepeat) % repeatRocks;

const max = rocksToStartRepeat + repeatRocks + extraRocks;
jetIndex = 0;
chamber = [];
for (let i = 0; i < max; i++) {
	dropRock(i % 5);
}
const finalHeight = getHeight();

console.log(
	repeatStart + repeats * (repeatEnd - repeatStart) + (finalHeight - repeatEnd)
);

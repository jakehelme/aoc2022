const fs = require('fs');
const raw = fs.readFileSync('./d22.txt', 'utf8');

let [rawMap, rawDirections] = raw.split('\n\n');
const maxWidth = rawMap.split('\n').reduce((max, row) => {
	return Math.max(row.length, max);
}, 0);

rawMap = rawMap.split('\n');

const map = [];
for (let y = 0; y < rawMap.length; y++) {
	map.push([]);
	const points = rawMap[y].split('');
	for (let x = 0; x < maxWidth; x++) {
		if (x >= points.length) map[y].push(' ');
		else map[y].push(points[x]);
	}
}

const moves = [];
for (let match of rawDirections.matchAll(/(\d+)([LR])/g)) {
	moves.push(Number(match[1]));
	moves.push(match[2]);
}

moves.push(Number(rawDirections.match(/(\d+)$/)[1]));

function wrapNext(next) {
	if (next.y < 0) next.y = map.length - 1;
	else if (next.y >= map.length) next.y = 0;
	else if (next.x < 0) next.x = map[0].length - 1;
	else if (next.x >= map[0].length) next.x = 0;
}

function wrapNext3d(pos, next) {
	const { y, x } = next;
	if (y >= 0 && y < 50 && x === 49) {
		next.y = 149 - pos.y;
		next.x = 0;
		next.moveDir = { y: 0, x: 1 };
	} else if (y === -1 && x >= 50 && x < 100) {
		next.y = 100 + pos.x;
		next.x = 0;
		next.moveDir = { y: 0, x: 1 };
	} else if (y === -1 && x >= 100 && x < 150) {
		next.y = 199;
		next.x = pos.x - 100;
	} else if (y >= 0 && y < 50 && x === 150) {
		next.y = 149 - pos.y;
		next.x = 99;
		next.moveDir = { y: 0, x: -1 };
	} else if (y === 50 && x >= 100 && x < 150) {
		next.y = pos.x - 50;
		next.x = 99;
		next.moveDir = { y: 0, x: -1 };
	} else if (y >= 50 && y < 100 && x === 100) {
		next.y = 49;
		next.x = pos.y + 50;
		next.moveDir = { y: -1, x: 0 };
	} else if (y >= 100 && y < 150 && x === 100) {
		next.y = 149 - pos.y;
		next.x = 149;
		next.moveDir = { y: 0, x: -1 };
	} else if (y === 150 && x >= 50 && x < 100) {
		next.y = pos.x + 100;
		next.x = 49;
		next.moveDir = { y: 0, x: -1 };
	} else if (y >= 150 && y < 200 && x === 50) {
		next.y = 149;
		next.x = pos.y - 100;
		next.moveDir = { y: -1, x: 0 };
	} else if (y === 200 && x >= 0 && x < 50) {
		next.y = 0;
		next.x = pos.x + 100;
	} else if (y >= 150 && y < 200 && x === -1) {
		next.y = 0;
		next.x = pos.y - 100;
		next.moveDir = { y: 1, x: 0 };
	} else if (y >= 100 && y < 150 && x === -1) {
		next.y = 149 - pos.y;
		next.x = 50;
		next.moveDir = { y: 0, x: 1 };
	} else if (y === 99 && x >= 0 && x < 50) {
		next.y = pos.x + 50;
		next.x = 50;
		next.moveDir = { y: 0, x: 1 };
	} else if (y >= 50 && y < 100 && x === 49) {
		next.y = 100;
		next.x = pos.y - 50;
		next.moveDir = { y: 1, x: 0 };
	}
}

function part1() {
	let pos = { y: 0, x: map[0].indexOf('.'), moveDir: { y: 0, x: 1 } };

	move: for (const move of moves) {
		switch (typeof move) {
			case 'number':
				for (let i = 0; i < move; i++) {
					const next = { y: pos.y + pos.moveDir.y, x: pos.x + pos.moveDir.x };
					wrapNext(next);

					while (map[next.y][next.x] === ' ') {
						next.y = next.y + pos.moveDir.y;
						next.x = next.x + pos.moveDir.x;
						wrapNext(next);
					}

					switch (map[next.y][next.x]) {
						case '.':
							pos.y = next.y;
							pos.x = next.x;
							break;
						case '#':
							continue move;
					}
				}
				break;
			case 'string':
				switch (move) {
					case 'R':
						pos.moveDir = { y: pos.moveDir.x, x: -1 * pos.moveDir.y };
						break;
					case 'L':
						pos.moveDir = { y: -1 * pos.moveDir.x, x: pos.moveDir.y };
						break;
				}
				break;
		}
	}

	let facing;
	if (pos.moveDir.y === 0 && pos.moveDir.x === 1) facing = 0;
	else if (pos.moveDir.y === 1 && pos.moveDir.x === 0) facing = 1;
	else if (pos.moveDir.y === 0 && pos.moveDir.x === -1) facing = 2;
	else if (pos.moveDir.y === -1 && pos.moveDir.x === 0) facing = 3;

	console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + facing);
}

function part2() {
	let pos = { y: 0, x: map[0].indexOf('.'), moveDir: { y: 0, x: 1 } };

	move: for (const move of moves) {
		switch (typeof move) {
			case 'number':
				for (let i = 0; i < move; i++) {
					const next = {
						y: pos.y + pos.moveDir.y,
						x: pos.x + pos.moveDir.x,
						moveDir: { y: pos.moveDir.y, x: pos.moveDir.x }
					};
					if (
						next.y >= map.length ||
						next.x >= map[0].length ||
						next.y < 0 ||
						next.x < 0 ||
						map[next.y][next.x] === ' '
					) {
						wrapNext3d(pos, next);
					}
					switch (map[next.y][next.x]) {
						case '.':
							pos.y = next.y;
							pos.x = next.x;
							pos.moveDir.y = next.moveDir.y;
							pos.moveDir.x = next.moveDir.x;
							break;
						case '#':
							continue move;
					}
				}
				break;
			case 'string':
				switch (move) {
					case 'R':
						pos.moveDir = { y: pos.moveDir.x, x: -1 * pos.moveDir.y };
						break;
					case 'L':
						pos.moveDir = { y: -1 * pos.moveDir.x, x: pos.moveDir.y };
						break;
				}
				break;
		}
	}

	let facing;
	if (pos.moveDir.y === 0 && pos.moveDir.x === 1) facing = 0;
	else if (pos.moveDir.y === 1 && pos.moveDir.x === 0) facing = 1;
	else if (pos.moveDir.y === 0 && pos.moveDir.x === -1) facing = 2;
	else if (pos.moveDir.y === -1 && pos.moveDir.x === 0) facing = 3;

	console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + facing);
}

part1();
part2();

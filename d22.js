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

function printMap() {
	for (const row of map) console.log(row.join(''));
	console.log();
}

function wrapNext(next) {
	if(next.y < 0) next.y = map.length - 1;
	else if (next.y >= map.length) next.y = 0;
	else if (next.x < 0) next.x = map[0].length - 1;
	else if (next.x >= map[0].length) next.x = 0;
}

printMap();

let pos = { y: 0, x: map[0].indexOf('.'), moveDir: { y: 0, x: 1 } };
const moves = [];
for (let match of rawDirections.matchAll(/(\d+)([LR])/g)) {
	moves.push(Number(match[1]));
	moves.push(match[2]);
}



moves.push(Number(rawDirections.match(/(\d+)$/)[1]));

move: for (const move of moves) {
	switch (typeof move) {
		case 'number':
			for (let i = 0; i < move; i++) {
				const next = { y: pos.y + pos.moveDir.y, x: pos.x + pos.moveDir.x };
				wrapNext(next);

				while(map[next.y][next.x] === ' ') {
					next.y = next.y + pos.moveDir.y;
					next.x = next.x + pos.moveDir.x;
					wrapNext(next);
				}

				switch (map[next.y][next.x]) {
					case '.':
						pos.y = next.y;
						pos.x = next.x;
						break;
					case ' ':
						console.log();
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
if(pos.moveDir.y === 0 && pos.moveDir.x === 1) facing = 0;
else if(pos.moveDir.y === 1 && pos.moveDir.x === 0) facing = 1;
else if(pos.moveDir.y === 0 && pos.moveDir.x === -1) facing = 2;
else if(pos.moveDir.y === -1 && pos.moveDir.x === 0) facing = 3;

console.log(((pos.y + 1) * 1000) + ((pos.x + 1) * 4) + facing);

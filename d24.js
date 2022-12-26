const fs = require('fs');
const rawRows = fs.readFileSync('./d24.txt', 'utf8').split('\n');

function parseBlizzards() {
	let blizzards = [];
	for (let y = 0; y < rawRows.length; y++) {
		blizzards.push([]);
		for (let x = 0; x < rawRows[y].length; x++) {
			if (/[<>\^v#]/.test(rawRows[y][x])) blizzards[y].push([rawRows[y][x]]);
			else blizzards[y].push([]);
		}
	}
	return blizzards;
}

function moveBlizzards(blizzards) {
	const newBlizzards = blizzards.map((row) =>
		Array.from({ length: row.length }, () => [])
	);
	for (let y = 0; y < blizzards.length; y++) {
		for (let x = 0; x < blizzards[0].length; x++) {
			for (const bliz of blizzards[y][x]) {
				switch (bliz) {
					case '^':
						if (blizzards[y - 1][x].indexOf('#') > -1) {
							newBlizzards[blizzards.length - 2][x].push('^');
						} else {
							newBlizzards[y - 1][x].push('^');
						}
						break;
					case '>':
						if (blizzards[y][x + 1].indexOf('#') > -1) {
							newBlizzards[y][1].push('>');
						} else {
							newBlizzards[y][x + 1].push('>');
						}
						break;
					case '<':
						if (blizzards[y][x - 1].indexOf('#') > -1) {
							newBlizzards[y][blizzards[0].length - 2].push('<');
						} else {
							newBlizzards[y][x - 1].push('<');
						}
						break;
					case 'v':
						if (blizzards[y + 1][x].indexOf('#') > -1) {
							newBlizzards[1][x].push('v');
						} else {
							newBlizzards[y + 1][x].push('v');
						}
						break;
					case '#':
						newBlizzards[y][x].push('#');
						break;
					default:
						break;
				}
			}
		}
	}
	return newBlizzards;
}

function getNextMoves(positions, blizzards) {
	const moves = new Set();
	for (const [y, x] of positions) {
		if (y && blizzards[y - 1][x].length === 0) {
			moves.add(`${y - 1},${x}`);
		}
		if (y !== blizzards.length - 1 && blizzards[y + 1][x].length === 0) {
			moves.add(`${y + 1},${x}`);
		}
		if (blizzards[y][x - 1].length === 0) {
			moves.add(`${y},${x - 1}`);
		}
		if (blizzards[y][x + 1].length === 0) {
			moves.add(`${y},${x + 1}`);
		}
		moves.add(`${y},${x}`);
	}
	return moves;
}

function there() {
	let minutes = 0;
	let positions = [[0, 1]];
	let blizzards = parseBlizzards();
	loop: while (true) {
		minutes++;

		blizzards = moveBlizzards(blizzards);

		positions = [...getNextMoves(positions, blizzards)].map((move) =>
			move.split(',').map(Number)
		);
		positions = positions.filter(([y, x]) => !blizzards[y][x].length);
		for (const [y, x] of positions) {
			if (y === blizzards.length - 1 && x === blizzards[0].length - 2) {
				console.log(minutes);
				break loop;
			}
		}
	}
}

function thereAndBackAgainAndThenThereAgain() {
	let minutes = 0;
	let positions = [[0, 1]];
	let blizzards = parseBlizzards();
	let gotThere = false;
	let gotBackAgain = false;
	loop: while (true) {
		minutes++;

		blizzards = moveBlizzards(blizzards);

		positions = [...getNextMoves(positions, blizzards)].map((move) =>
			move.split(',').map(Number)
		);
		positions = positions.filter(([y, x]) => !blizzards[y][x].length);
		for (const [y, x] of positions) {
			if (
				!gotThere &&
				y === blizzards.length - 1 &&
				x === blizzards[0].length - 2
			) {
				gotThere = true;
				positions = [[blizzards.length - 1, blizzards[0].length - 2]];
				break;
			} else if (gotThere && !gotBackAgain && y === 0 && x === 1) {
				gotBackAgain = true;
				positions = [[0, 1]];
				break;
			} else if (
				gotThere &&
				gotBackAgain &&
				y === blizzards.length - 1 &&
				x === blizzards[0].length - 2
			) {
				console.log(minutes);
				break loop;
			}
		}
	}
}

there();
thereAndBackAgainAndThenThereAgain();

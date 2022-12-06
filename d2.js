const fs = require('fs');

const raw = fs.readFileSync('./d2.txt', 'utf8');

const moves = raw.split('\n').map((x) => x.split(' '));
let p1total = 0;

moves.forEach((x) => {
	let score = 0;
	switch (x[0]) {
		case 'A':
			switch (x[1]) {
				case 'X':
					score = 1 + 3;
					break;
				case 'Y':
					score = 2 + 6;
					break;
				case 'Z':
					score = 3 + 0;
					break;
			}
			break;
		case 'B':
			switch (x[1]) {
				case 'X':
					score = 1 + 0;
					break;
				case 'Y':
					score = 2 + 3;
					break;
				case 'Z':
					score = 3 + 6;
					break;
			}
			break;
		case 'C':
			switch (x[1]) {
				case 'X':
					score = 1 + 6;
					break;
				case 'Y':
					score = 2 + 0;
					break;
				case 'Z':
					score = 3 + 3;
					break;
			}
			break;
	}
	p1total += score;
});

let p2total = 0;

moves.forEach((x) => {
	let score = 0;
	switch (x[0]) {
		case 'A':
			switch (x[1]) {
				case 'X':
					score = 3 + 0;
					break;
				case 'Y':
					score = 1 + 3;
					break;
				case 'Z':
					score = 2 + 6;
					break;
			}
			break;
		case 'B':
			switch (x[1]) {
				case 'X':
					score = 1 + 0;
					break;
				case 'Y':
					score = 2 + 3;
					break;
				case 'Z':
					score = 3 + 6;
					break;
			}
			break;
		case 'C':
			switch (x[1]) {
				case 'X':
					score = 2 + 0;
					break;
				case 'Y':
					score = 3 + 3;
					break;
				case 'Z':
					score = 1 + 6;
					break;
			}
			break;
	}
	p2total += score;
});

console.log(p1total);
console.log(p2total);

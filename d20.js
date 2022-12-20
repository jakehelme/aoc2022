const fs = require('fs');
const raw = fs.readFileSync('./d20.txt', 'utf8');

let numbers = raw.split('\n').map((n, i) => ({ val: Number(n), index: i }));

function mixNumbers() {
	for (let i = 0; i < numbers.length; i++) {
		if (numbers[i].val === 0) continue;
		let newIndex = (numbers[i].index + numbers[i].val) % (numbers.length - 1);
		if (newIndex <= 0) {
			newIndex += numbers.length - 1;
		}
		let needsIndexUpdate = [];
		if (newIndex > numbers[i].index)
			needsIndexUpdate = numbers
				.filter((n) => n.index <= newIndex && n.index > numbers[i].index)
				.forEach((n) => (n.index = n.index - 1));
		else if (newIndex < numbers[i].index)
			needsIndexUpdate = numbers
				.filter((n) => n.index < numbers[i].index && n.index >= newIndex)
				.forEach((n) => (n.index = n.index + 1));

		numbers[i].index = newIndex;
	}
}

mixNumbers();

let coordSum = 0;
[1000, 2000, 3000].forEach((pos) => {
	const ind = (numbers.filter((n) => !n.val)[0].index + pos) % numbers.length;
	const val = numbers.filter((n) => n.index === ind)[0].val;
	coordSum += val;
});

console.log(coordSum);

const decryptionKey = 811589153;
numbers = raw
	.split('\n')
	.map((n, i) => ({ val: Number(n) * decryptionKey, index: i }));
for (let i = 0; i < 10; i++) {
	mixNumbers();
}

coordSum = 0;
[1000, 2000, 3000].forEach((pos) => {
	const ind = (numbers.filter((n) => !n.val)[0].index + pos) % numbers.length;
	const val = numbers.filter((n) => n.index === ind)[0].val;
	coordSum += val;
});

console.log(coordSum);

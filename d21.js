const fs = require('fs');
const raw = fs.readFileSync('./d21.txt', 'utf8');

function parseInput() {
	return raw.split('\n').reduce((obj, m) => {
		const [name, job] = m.split(': ');
		obj[name] = /\d+/.test(job) ? Number(job) : job.split(' ');
		return obj;
	}, {});
}

let monkeys = parseInput(false);

search: while (true) {
	for (const monkey in monkeys) {
		const job = monkeys[monkey];
		if (typeof job !== 'number') {
			const [operand1, operator, operand2] = job;
			if (
				typeof monkeys[operand1] === 'number' &&
				typeof monkeys[operand2] === 'number'
			) {
				switch (operator) {
					case '+':
						monkeys[monkey] = monkeys[operand1] + monkeys[operand2];
						break;
					case '-':
						monkeys[monkey] = monkeys[operand1] - monkeys[operand2];
						break;
					case '*':
						monkeys[monkey] = monkeys[operand1] * monkeys[operand2];
						break;
					case '/':
						monkeys[monkey] = monkeys[operand1] / monkeys[operand2];
						break;
				}
				if (monkey === 'root') break search;
			}
		}
	}
}

console.log(monkeys.root);

monkeys = parseInput(false);
monkeys.humn = null;

let somethingHappened = true;
while (somethingHappened) {
	somethingHappened = false;
	for (const monkey in monkeys) {
		if (monkey === 'humn') continue;
		const job = monkeys[monkey];
		if (typeof job !== 'number') {
			const [operand1, operator, operand2] = job;

			if (
				typeof monkeys[operand1] === 'number' &&
				typeof monkeys[operand2] !== 'number'
			) {
				monkeys[monkey][0] = monkeys[operand1];
				somethingHappened = true;
			}

			if (
				typeof monkeys[operand2] === 'number' &&
				typeof monkeys[operand1] !== 'number'
			) {
				monkeys[monkey][2] = monkeys[operand2];
				somethingHappened = true;
			}

			if (
				typeof monkeys[operand1] === 'number' &&
				typeof monkeys[operand2] === 'number'
			) {
				switch (operator) {
					case '+':
						monkeys[monkey] = monkeys[operand1] + monkeys[operand2];
						break;
					case '-':
						monkeys[monkey] = monkeys[operand1] - monkeys[operand2];
						break;
					case '*':
						monkeys[monkey] = monkeys[operand1] * monkeys[operand2];
						break;
					case '/':
						monkeys[monkey] = monkeys[operand1] / monkeys[operand2];
						break;
				}
				somethingHappened = true;
			} else if (typeof operand1 === 'number' && typeof operand2 === 'number') {
				switch (operator) {
					case '+':
						monkeys[monkey] = operand1 + operand2;
						break;
					case '-':
						monkeys[monkey] = operand1 - operand2;
						break;
					case '*':
						monkeys[monkey] = operand1 * operand2;
						break;
					case '/':
						monkeys[monkey] = operand1 / operand2;
						break;
				}
				somethingHappened = true;
			}
		}
	}
}

let [lookup, targetValue] =
	typeof monkeys.root[0] === 'string'
		? [monkeys.root[0], monkeys.root[2]]
		: [monkeys.root[2], monkeys.root[0]];
while (true) {
	let [nextLookup, operator, nextTargetValue, placing] =
		typeof monkeys[lookup][0] === 'string'
			? [monkeys[lookup][0], monkeys[lookup][1], monkeys[lookup][2], 'left']
			: [monkeys[lookup][2], monkeys[lookup][1], monkeys[lookup][0], 'right'];
	switch (operator) {
		case '+':
			targetValue = targetValue - nextTargetValue;
			break;
		case '-':
			if (placing === 'left') {
				targetValue = targetValue + nextTargetValue;
			} else {
				targetValue = nextTargetValue - targetValue;
			}
			break;
		case '*':
			targetValue = targetValue / nextTargetValue;
			break;
		case '/':
			if (placing === 'left') {
				targetValue = targetValue * nextTargetValue;
			} else {
				targetValue = nextTargetValue / targetValue;
			}
			break;
	}
	if (nextLookup === 'humn') break;
	lookup = nextLookup;
}

console.log(targetValue);

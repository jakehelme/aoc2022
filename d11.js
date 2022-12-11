const fs = require('fs');
const raw = fs.readFileSync('./d11.txt', 'utf8');

const rawMonkeyNotes = raw.split('\n\n').map((x) => x.split('\n').slice(1));

function parseInput() {
	const mArr = [];

	rawMonkeyNotes.forEach((m) => {
		const monkey = {};
		monkey.startingItems = m[0].match(/\d+/g).map(Number);
		monkey.op = {
			operator: m[1].match(/[\*\+]/)[0],
			operand: /old$/.test(m[1]) ? 'old' : Number(m[1].match(/\d+$/)[0]),
		};
		monkey.test = {
			divider: Number(m[2].match(/\d+/)[0]),
			trueMonkey: Number(m[3].match(/\d+/)[0]),
			falseMonkey: Number(m[4].match(/\d+/)[0]),
		};
		monkey.inspections = 0;
		mArr.push(monkey);
	});
	return mArr;
}

let monkeys = parseInput();

function doOperation(operation, oldVal) {
	const operand =
		operation.operand === 'old' ? Number(oldVal) : operation.operand;
	switch (operation.operator) {
		case '*':
			return oldVal * operand;
		case '+':
			return oldVal + operand;
		default:
			throw new Error('nope');
	}
}

for (let round = 0; round < 20; round++) {
	for (const monkey of monkeys) {
		for (let i = 0; i < monkey.startingItems.length; i++) {
			monkey.inspections++;
			monkey.startingItems[i] = doOperation(monkey.op, monkey.startingItems[i]);
			monkey.startingItems[i] = Math.floor(monkey.startingItems[i] / 3);
			if (monkey.startingItems[i] % monkey.test.divider === 0) {
				monkeys[monkey.test.trueMonkey].startingItems.push(
					monkey.startingItems[i]
				);
			} else {
				monkeys[monkey.test.falseMonkey].startingItems.push(
					monkey.startingItems[i]
				);
			}
		}
		monkey.startingItems = [];
	}
}

let monkeyInspections = monkeys.map((m) => m.inspections).sort((a, b) => b - a);

console.log(monkeyInspections[0] * monkeyInspections[1]);

monkeys = parseInput();

const prodOfDivisors = monkeys.reduce((tot, m) => tot * m.test.divider, 1);

for (let round = 0; round < 10000; round++) {
	for (const monkey of monkeys) {
		for (let i = 0; i < monkey.startingItems.length; i++) {
			monkey.inspections++;
			monkey.startingItems[i] = monkey.startingItems[i] % prodOfDivisors;
			monkey.startingItems[i] = doOperation(monkey.op, monkey.startingItems[i]);
			if (monkey.startingItems[i] % monkey.test.divider === 0) {
				monkeys[monkey.test.trueMonkey].startingItems.push(
					monkey.startingItems[i]
				);
			} else {
				monkeys[monkey.test.falseMonkey].startingItems.push(
					monkey.startingItems[i]
				);
			}
		}
		monkey.startingItems = [];
	}
}

monkeyInspections = monkeys.map((m) => m.inspections).sort((a, b) => b - a);

console.log(monkeyInspections[0] * monkeyInspections[1]);

const fs = require('fs');
const raw = fs.readFileSync('./d21.txt', 'utf8');

function parseInput() {
	return raw.split('\n').reduce((obj, m) => {
		const [name, job] = m.split(': ');
		obj[name] = /\d+/.test(job) ? Number(job) : job.split(' ');
		return obj;
	}, {});
}

let monkeys = parseInput();

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

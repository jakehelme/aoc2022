// Heavily 'inspired' by this approach: https://github.com/CodingAP/advent-of-code/blob/main/profiles/github/2022/day16/solution.js
const fs = require('fs');
const raw = fs.readFileSync('./d16.txt', 'utf8');

const travelDistances = {};
const valveRates = {};
const tunnels = {};

raw.split('\n').forEach((row) => {
	const matches = row.match(
		/^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/
	);
	const [_, valveName, flowRate, tunnelDestinations] = matches;
	tunnels[valveName] = tunnelDestinations.split(', ');
	valveRates[valveName] = Number(flowRate);
});

function getDistance(start, end) {
	const frontier = [start];
	const cameFrom = { [start]: null };

	while (frontier.length) {
		const current = frontier.shift();
		if (current === end) break;

		for (const next of tunnels[current]) {
			if (!cameFrom[next]) {
				frontier.push(next);
				cameFrom[next] = current;
			}
		}
	}

	let current = end;
	const path = [];
	while (current !== start) {
		path.push(current);
		current = cameFrom[current];
	}
	return path.length;
}

function turnOnValves(valve, minutes, valvesLeft, openValves) {
	const permutations = [openValves];

	for (const [i, nextValve] of valvesLeft.entries()) {
		const nextMinutes = minutes - travelDistances[valve][nextValve] - 1;
		if (nextMinutes < 1) continue;

		let nextOpenValves = JSON.parse(JSON.stringify(openValves));
		nextOpenValves[nextValve] = nextMinutes;

		let nextValvesLeft = [...valvesLeft];
		nextValvesLeft.splice(i, 1);

		permutations.push(
			...turnOnValves(nextValve, nextMinutes, nextValvesLeft, nextOpenValves)
		);
	}

	return permutations;
}

for (const start in tunnels) {
	travelDistances[start] = {};
	for (const end in tunnels) {
		travelDistances[start][end] = getDistance(start, end);
	}
}

const goodValves = Object.keys(valveRates).filter((v) => valveRates[v]);

let permutations = turnOnValves('AA', 30, goodValves, {});
const pressureReleased = permutations
	.map((p) => Object.entries(p))
	.map((p) =>
		p.reduce((tot, [valve, minutes]) => tot + valveRates[valve] * minutes, 0)
	);

pressureReleased.sort((a, b) => b - a);

console.log(pressureReleased[0]);

permutations = turnOnValves('AA', 26, goodValves, {});
const maxScores = {};

permutations.forEach((p) => {
	const key = Object.keys(p).sort().join('|');
	const score = Object.entries(p).reduce(
		(tot, [key, value]) => tot + valveRates[key] * value,
		0
	);

	if (maxScores[key] == null) maxScores[key] = -Infinity;
	maxScores[key] = Math.max(score, maxScores[key]);
});

let max = -Infinity;
Object.keys(maxScores).forEach((player) => {
	Object.keys(maxScores).forEach((elephant) => {
		const valveSet = new Set();
		const playerList = player.split('|');
		playerList.forEach((valve) => valveSet.add(valve));
		const elephantList = elephant.split('|');
		elephantList.forEach((valve) => valveSet.add(valve));

		if (valveSet.size === playerList.length + elephantList.length) {
			max = Math.max(maxScores[player] + maxScores[elephant], max);
		}
	});
});

console.log(max);

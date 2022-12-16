const fs = require('fs');
const raw = fs.readFileSync('./d16.txt', 'utf8');

const valves = raw.split('\n').reduce((dict, row) => {
	const matches = row.match(
		/^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/
	);
	const [_, valveName, flowRate, tunnelDestinations] = matches;
	dict[valveName] = {
		rate: Number(flowRate),
		tunnels: tunnelDestinations.split(', '),
	};
	return dict;
}, {});

const maxMinutes = 30;
// const startingScenario = createNewScenario(0, 1, 'AA', new Set());

// function createNewScenario(
// 	pressureReleased,
// 	minuteIndex,
// 	currentValve,
// 	openValves
// ) {
// 	return { pressureReleased, minuteIndex, currentValve, openValves };
// }

function permute(permutation) {
	var length = permutation.length,
		result = [permutation.slice()],
		c = new Array(length).fill(0),
		i = 1, k, p;
  
	while (i < length) {
	  if (c[i] < i) {
		k = i % 2 && c[i];
		p = permutation[i];
		permutation[i] = permutation[k];
		permutation[k] = p;
		++c[i];
		i = 1;
		result.push(permutation.slice());
	  } else {
		c[i] = 0;
		++i;
	  }
	}
	return result;
  }

const workingValves = [];

for (const valve in valves) {
	if (Object.hasOwnProperty.call(valves, valve)) {
		if (valves[valve].rate) workingValves.push(valve);
	}
}

const combos = permute(Object.keys(workingValves));

console.log(combos.length);

// function progressMinute(state) {
// 	const scenarios = [];
// 	// check valves open
// 	let pressure = state.pressureReleased;
// 	for (const valve of state.openValves) {
// 		pressure += valves[valve].rate;
// 	}

// 	// do something: open valve, move to different valve, do nothing
// 	if (
// 		state.currentValve !== 'AA' &&
// 		!state.openValves.has(state.currentValve) &&
// 		valves[state.currentValve].rate
// 	) {
// 		scenarios.push(
// 			createNewScenario(
// 				pressure,
// 				state.minuteIndex + 1,
// 				state.currentValve,
// 				new Set([...state.openValves, state.currentValve])
// 			)
// 		);
// 	}

// 	for (const tunnel of valves[state.currentValve].tunnels) {
// 		scenarios.push(
// 			createNewScenario(
// 				pressure,
// 				state.minuteIndex + 1,
// 				tunnel,
// 				new Set([...state.openValves])
// 			)
// 		);
// 	}

// 	return scenarios;
// }

// let scenarios = progressMinute(startingScenario);
// while(scenarios[0].minuteIndex <= maxMinutes) {
// 	const nextScenarios = [];
// 	for (const result of scenarios) {
// 		nextScenarios.push(...progressMinute(result));
// 	}
// 	scenarios = nextScenarios;
// }

console.log();

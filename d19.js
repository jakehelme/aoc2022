const fs = require('fs');
const raw = fs.readFileSync('./d19.txt', 'utf8');

const blueprints = raw.split('\n').map((l) => {
	const matches = l.match(
		/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
	);
	return {
		oreRobot: { ore: Number(matches[2]) },
		clayRobot: { ore: Number(matches[3]) },
		obsidianRobot: { ore: Number(matches[4]), clay: Number(matches[5]) },
		geodeRobot: { ore: Number(matches[6]), obsidian: Number(matches[7]) }
	};
});

function getMaxGeodes(blueprint, length) {
	const startingState = {
		minutes: 0,
		robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
		ore: 0,
		clay: 0,
		obsidian: 0,
		geode: 0
	};

	// let permutations = { [getKey(startingState)]: startingState };
	// let permutations = [startingState];

	function getKey(state) {
		return `${state.minutes}|${state.robots.ore}|${state.robots.clay}|${state.robots.obsidian}|${state.robots.geode}|${state.ore}|${state.clay}|${state.obsidian}|${state.geode}`;
	}

	function getState(key) {
		const [min, ro, rc, rb, rg, o, c, b, g] = key.split('|');
		return {
			minutes: Number(min),
			robots: {
				ore: Number(ro),
				clay: Number(rc),
				obsidian: Number(rb),
				geode: Number(rg)
			},
			ore: Number(o),
			clay: Number(c),
			obsidian: Number(b),
			geode: Number(g)
		};
	}

	function dfs(start) {
		const frontier = [];
		frontier.push(start);
		const reached = {};
		reached[start] = null;
		// let geodesMade = [];
		let maxGeodes = 0;

		while (frontier.length) {
			const current = frontier.pop();
			const currentState = getState(current);
			if (currentState.minutes === length) {
				// geodesMade.push(currentState.geode);
				// console.log(currentState.geode);
				maxGeodes = Math.max(currentState.geode, maxGeodes);
				continue;
			}
			for (const next of elapseMinute(current)) {
				if (!reached[next]) {
					frontier.push(next);
					reached[next] = null;
				}
			}
		}
		return maxGeodes;
	}

	function elapseMinute(key) {
		const state = getState(key);
		state.minutes += 1;
		const nextStates = [];

		const canBuildOreRobot = blueprints[blueprint].oreRobot.ore <= state.ore;
		const canBuildClayRobot = blueprints[blueprint].clayRobot.ore <= state.ore;
		const canBuildObsidianRobot =
			blueprints[blueprint].obsidianRobot.ore <= state.ore &&
			blueprints[blueprint].obsidianRobot.clay <= state.clay;
		const canBuildGeodeRobot =
			blueprints[blueprint].geodeRobot.ore <= state.ore &&
			blueprints[blueprint].geodeRobot.obsidian <= state.obsidian;

		// const shouldBuildOreRobot = state.robots.ore < 6;
		const shouldBuildOreRobot =
			state.robots.ore * (length - state.minutes) + state.ore <
			(length - state.minutes) *
				Math.max(
					blueprints[blueprint].oreRobot.ore,
					blueprints[blueprint].clayRobot.ore,
					blueprints[blueprint].obsidianRobot.ore,
					blueprints[blueprint].geodeRobot.ore
				);
		const shouldBuildClayRobot =
			state.robots.clay * (length - state.minutes) + state.clay <
			(length - state.minutes) * blueprints[blueprint].obsidianRobot.clay;

		const shouldBuildObsidianRobot =
			state.robots.obsidian * (length - state.minutes) + state.obsidian <
			(length - state.minutes) * blueprints[blueprint].geodeRobot.obsidian;

		for (const material in state.robots) {
			const robotCount = state.robots[material];
			state[material] += robotCount;
		}

		if (canBuildGeodeRobot) {
			const newState = structuredClone(state);
			newState.robots.geode += 1;
			newState.ore -= blueprints[blueprint].geodeRobot.ore;
			newState.obsidian -= blueprints[blueprint].geodeRobot.obsidian;
			nextStates.push(getKey(newState));
			return nextStates;
		}

		nextStates.push(getKey(state));
		if (canBuildOreRobot && shouldBuildOreRobot) {
			const newState = structuredClone(state);
			newState.robots.ore += 1;
			newState.ore -= blueprints[blueprint].oreRobot.ore;
			nextStates.push(getKey(newState));
		}
		if (canBuildClayRobot && shouldBuildClayRobot) {
			const newState = structuredClone(state);
			newState.robots.clay += 1;
			newState.ore -= blueprints[blueprint].clayRobot.ore;
			nextStates.push(getKey(newState));
		}
		if (canBuildObsidianRobot && shouldBuildObsidianRobot) {
			const newState = structuredClone(state);
			newState.robots.obsidian += 1;
			newState.ore -= blueprints[blueprint].obsidianRobot.ore;
			newState.clay -= blueprints[blueprint].obsidianRobot.clay;
			nextStates.push(getKey(newState));
		}
		

		return nextStates;
	}

	return dfs(getKey(startingState));

	// 	while (permutations[0].minutes <= 23) {
	// 		const nextStates = [];
	// 		permutations.forEach((state) => {
	// 			nextStates.push(...elapseMinute(state));
	// 		});
	// 		permutations = nextStates;
	// 	}
	// 	const maxGeodes = permutations.reduce(
	// 		(max, p) => (p.geode > max ? p.geode : max),
	// 		0
	// 	);
	// 	return maxGeodes;
	// }
}
// let qualitySum = 0;
// for (let i = 0; i < blueprints.length; i++) {
// 	const result = getMaxGeodes(i, 24);
// 	console.log(i, result);
// 	qualitySum += result * (i + 1);
// }

// console.log(qualitySum);

const maxGeodes = [];
for(let i = 0; i < 3; i++) {
	const result = getMaxGeodes(i, 32);
	console.log(i, result);
	maxGeodes.push(result);
};

console.log(maxGeodes.reduce((tot, g) => tot * g, 1));

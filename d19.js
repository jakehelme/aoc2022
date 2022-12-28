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

function getStateWhenRobotIsBuilt(robotType, current, blueprint, length) {
	const currentState = getState(current);
	const cost = blueprints[blueprint][`${robotType}Robot`];
	const minutesForOre = Math.max(
		Math.ceil((cost.ore - currentState.ore) / currentState.robots.ore) + 1,
		1
	);
	let waitTime;
	switch (robotType) {
		case 'ore':
		case 'clay':
			waitTime = minutesForOre;
			break;
		case 'obsidian':
			const minutesForClay = Math.max(
				Math.ceil((cost.clay - currentState.clay) / currentState.robots.clay) +	1,
				1
			);
			waitTime = Math.max(minutesForOre, minutesForClay);
			break;
		case 'geode':
			const minutesForObsidian = Math.max(
				Math.ceil(
					(cost.obsidian - currentState.obsidian) / currentState.robots.obsidian) + 1,
				1
			);
			waitTime = Math.max(minutesForOre, minutesForObsidian);
			break;
	}
	const nextState = structuredClone(currentState);
	let canBuildBeforeEnd = true;
	if (currentState.minutes + waitTime >= length) {
		waitTime = length - currentState.minutes;
		canBuildBeforeEnd = false;
	}

	nextState.minutes += waitTime;
	nextState.ore += waitTime * nextState.robots.ore;
	nextState.clay += waitTime * nextState.robots.clay;
	nextState.obsidian += waitTime * nextState.robots.obsidian;
	nextState.geode += waitTime * nextState.robots.geode;

	if (canBuildBeforeEnd) {
		nextState.ore -= cost.ore;
		nextState.clay -= cost.clay ? cost.clay : 0;
		nextState.obsidian -= cost.obsidian ? cost.obsidian : 0;
		nextState.robots[robotType] += 1;
	}

	return getKey(nextState);
}

function getNextStates(current, blueprint, length) {
	const currentState = getState(current);
	const nextStates = [];
	const shouldBuildOreRobot =
		currentState.robots.ore * (length - currentState.minutes) +
			currentState.ore <
		(length - currentState.minutes) *
			Math.max(
				blueprints[blueprint].oreRobot.ore,
				blueprints[blueprint].clayRobot.ore,
				blueprints[blueprint].obsidianRobot.ore,
				blueprints[blueprint].geodeRobot.ore
			);
	const shouldBuildClayRobot =
		currentState.robots.clay * (length - currentState.minutes) +
			currentState.clay <
		(length - currentState.minutes) * blueprints[blueprint].obsidianRobot.clay;

	const shouldBuildObsidianRobot =
		currentState.robots.obsidian * (length - currentState.minutes) +
			currentState.obsidian <
		(length - currentState.minutes) * blueprints[blueprint].geodeRobot.obsidian;

	if (shouldBuildOreRobot)
		nextStates.push(
			getStateWhenRobotIsBuilt('ore', current, blueprint, length)
		);
	if (shouldBuildClayRobot)
		nextStates.push(
			getStateWhenRobotIsBuilt('clay', current, blueprint, length)
		);
	if (currentState.robots.clay > 0 && shouldBuildObsidianRobot)
		nextStates.push(
			getStateWhenRobotIsBuilt('obsidian', current, blueprint, length)
		);

	if (currentState.robots.obsidian > 0)
		nextStates.push(
			getStateWhenRobotIsBuilt('geode', current, blueprint, length)
		);
	return nextStates;
}

function dfs(start, blueprint, length) {
	const frontier = [];
	frontier.push(start);
	const reached = new Set();
	reached.add(start);
	let maxGeodes = 0;

	while (frontier.length) {
		const current = frontier.pop();
		const currentState = getState(current);
		if (currentState.minutes === length) {
			maxGeodes = Math.max(currentState.geode, maxGeodes);
			continue;
		}
		for (const next of getNextStates(current, blueprint, length)) {
			if (!reached.has(next)) {
				frontier.push(next);
				reached.add(next);
			}
		}
	}
	return maxGeodes;
}

function getMaxGeodes(blueprint, length) {
	const startingState = {
		minutes: 0,
		robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
		ore: 0,
		clay: 0,
		obsidian: 0,
		geode: 0
	};

	const result = dfs(getKey(startingState), blueprint, length);
	return result;
}

console.time('Part 1');
let qualitySum = 0;
for (let i = 0; i < blueprints.length; i++) {
	const result = getMaxGeodes(i, 24);
	qualitySum += result * (i + 1);
}
console.log(qualitySum);
console.timeEnd('Part 1');

console.time('Part 2');
const maxGeodes = [];
for (let i = 0; i < 3; i++) {
	const result = getMaxGeodes(i, 32);
	maxGeodes.push(result);
}

console.log(maxGeodes.reduce((tot, g) => tot * g, 1));
console.timeEnd('Part 2');

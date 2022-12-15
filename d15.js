const fs = require('fs');
const raw = fs.readFileSync('./d15.txt', 'utf8');

const rowToCheck = 2000000;
const searchMax = 4000000;

function getRowIntervals(row, sensor) {
	if (sensor.distance - Math.abs(row - sensor.pos.y) < 0) return;
	const x1 = sensor.distance - Math.abs(row - sensor.pos.y) + sensor.pos.x;
	const x2 = -1 * (sensor.distance - Math.abs(row - sensor.pos.y)) + sensor.pos.x;
	const min = Math.min(x1, x2);
	const max = Math.max(x1, x2);
	return [min, max];
}

function mergeIntervals(intervals) {
	intervals.sort((a, b) => a[0] - b[0]);
	const stack = [];
	stack.push(intervals[0]);
	for (let i = 1; i < intervals.length; i++) {
		const top = [stack[stack.length - 1][0], stack[stack.length - 1][1]];

		if (top[1] < intervals[i][0]) {
			stack.push(intervals[i]);
		} else if (top[1] < intervals[i][1]) {
			top[1] = intervals[i][1];
			stack.pop();
			stack.push(top);
		}
	}
	return stack;
}

const sensors = raw
	.split('\n')
	.map((x) => x.match(/-?\d+/g).map(Number))
	.map((p) => ({
		pos: { x: p[0], y: p[1] },
		beacon: { x: p[2], y: p[3] },
		distance: Math.abs(p[0] - p[2]) + Math.abs(p[1] - p[3]),
	}));

const beacons = new Set();
sensors.forEach((sensor) => {
	beacons.add(`${sensor.beacon.y},${sensor.beacon.x}`);
});

const rowSegments = [];

sensors.forEach((sensor) => {
	const results = getRowIntervals(rowToCheck, sensor);
	if (results) rowSegments.push(results);
});

const beaconlessRanges = mergeIntervals([...rowSegments]);

const sensorsInRange = sensors.filter((s) => s.pos.y === rowToCheck).length;
const beaconsInRange = [...beacons].filter((b) => {
	const y = Number(b.split(',')[0]);
	return y === rowToCheck;
}).length;

const beaconlessSpaces = beaconlessRanges.reduce(
	(tot, r) => tot + r[1] - r[0] + 1,
	0
);

console.log(beaconlessSpaces - sensorsInRange - beaconsInRange);

for (let y = 0; y < searchMax; y++) {
	const rowSegments = [];
	sensors.forEach((sensor) => {
		const results = getRowIntervals(y, sensor);
		if (results) rowSegments.push(results);
	});
	const mergedRanges = mergeIntervals(rowSegments);
	if (mergedRanges.length > 1) {
		const x = mergedRanges[0][1] + 1;
		if (x >= 0 && x <= searchMax) {
			console.log(4000000 * x + y);
			break;
		}
	}
}

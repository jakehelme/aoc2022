const fs = require('fs');
const raw = fs.readFileSync('./d7.txt', 'utf8');

const outputs = raw.split('\n');

let level = 0;
const tree = { parent: null };
let node = null;

outputs.forEach((line) => {
	if (line.substring(0, 4) === '$ cd') {
		const dirTarget = line.match(/^.+\s([a-z\.\/]+)$/)[1];
		if (dirTarget == '/') {
			level = 0;
			node = tree;
		} else if (dirTarget === '..') {
			level -= 1;
			node = node.parent;
		} else {
			level++;
			node = node[dirTarget];
		}
	} else if (line === '$ ls') {
		console.log();
	} else if (line.substring(0, 3) === 'dir') {
		const dirName = line.match(/dir\s(\w+)/)[1];
		node[dirName] = { parent: node };
	} else {
		const [_, fileSize, fileName] = line.match(/(\d+)\s([a-z\.]+)/);
		node[fileName] = Number(fileSize);
	}
});

const dirSizes = [];

function calcDirSizes(dir) {
	let size = 0;
	Object.keys(dir).forEach((key) => {
		if (key === 'parent') {
			return;
		} else if (typeof dir[key] === 'object' && dir[key] !== null) {
			size += calcDirSizes(dir[key]);
		} else {
			size += dir[key];
		}
	});
	dirSizes.push(size);
	return size;
}

const rootSize = calcDirSizes(tree);

console.log(
	dirSizes.filter((dir) => dir <= 100000).reduce((tot, size) => tot + size, 0)
);

const totalSpace = 70000000;
const needed = 30000000;

const unused = totalSpace - rootSize;
const deleteAtLeast = needed - unused;

const qualifying = dirSizes
	.filter((dir) => dir >= deleteAtLeast)
	.sort((a, b) => a - b);

console.log(qualifying[0]);

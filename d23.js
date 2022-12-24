const fs = require('fs');
const raw = fs.readFileSync('./d23.txt', 'utf8').split('\n');
const gridSize = raw.length;
const directions = ['N', 'S', 'W', 'E'];
const grid = [];
for (let i = 0; i < gridSize; i++)
  grid.push(Array.from({ length: gridSize * 3 }, () => '.'));
raw.forEach((row) => {
  const rowArr = [];
  rowArr.push(...Array.from({ length: gridSize }, () => '.'));
  rowArr.push(...row.split(''));
  rowArr.push(...Array.from({ length: gridSize }, () => '.'));
  grid.push(rowArr);
});
for (let i = 0; i < gridSize; i++)
  grid.push(Array.from({ length: gridSize * 3 }, () => '.'));

let rounds = 0;
while (true) {
  rounds++;
  const proposed = {};
  for (let y = 0; y < grid.length; y++) {
    elf: for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '#') {
        search: for (let i = y - 1; i <= y + 1; i++) {
          for (let j = x - 1; j <= x + 1; j++) {
            if (!(i === y && j === x) && grid[i][j] === '#') {
              break search;
            }
            if (i === y + 1 && j === x + 1) continue elf;
          }
        }
        dir: for (const dir of directions) {
          switch (dir) {
            case 'N':
              if (
                grid[y - 1][x - 1] !== '#' &&
                grid[y - 1][x] !== '#' &&
                grid[y - 1][x + 1] !== '#'
              ) {
                if (proposed[`${y - 1},${x}`])
                  proposed[`${y - 1},${x}`].push([y, x]);
                else proposed[`${y - 1},${x}`] = [[y, x]];
                break dir;
              }
              break;
            case 'S':
              if (
                grid[y + 1][x - 1] !== '#' &&
                grid[y + 1][x] !== '#' &&
                grid[y + 1][x + 1] !== '#'
              ) {
                if (proposed[`${y + 1},${x}`])
                  proposed[`${y + 1},${x}`].push([y, x]);
                else proposed[`${y + 1},${x}`] = [[y, x]];
                break dir;
              }
              break;
            case 'W':
              if (
                grid[y - 1][x - 1] !== '#' &&
                grid[y][x - 1] !== '#' &&
                grid[y + 1][x - 1] !== '#'
              ) {
                if (proposed[`${y},${x - 1}`])
                  proposed[`${y},${x - 1}`].push([y, x]);
                else proposed[`${y},${x - 1}`] = [[y, x]];
                break dir;
              }
              break;
            case 'E':
              if (
                grid[y - 1][x + 1] !== '#' &&
                grid[y][x + 1] !== '#' &&
                grid[y + 1][x + 1] !== '#'
              ) {
                if (proposed[`${y},${x + 1}`])
                  proposed[`${y},${x + 1}`].push([y, x]);
                else proposed[`${y},${x + 1}`] = [[y, x]];
                break dir;
              }
              break;
          }
        }
      }
    }
  }
  if (Object.keys(proposed).length === 0) break;
  directions.push(directions.shift());
  for (const [key, elves] of Object.entries(proposed)) {
    if (elves.length === 1) {
      const [y, x] = key.split(',').map(Number);
      grid[y][x] = '#';
      grid[elves[0][0]][elves[0][1]] = '.';
    }
  }
  if (rounds === 10) {
    let minY = Infinity;
    let maxY = 0;
    let minX = Infinity;
    let maxX = 0;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '#') {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      }
    }
    let empties = 0;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (grid[y][x] === '.') empties++;
      }
    }
    console.log(empties);
  }
}

console.log(rounds);

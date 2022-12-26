const fs = require('fs');
const raw = fs.readFileSync('./d25.txt', 'utf8');

const snafus = raw.split('\n');

let tot = 0;

for (const snafu of snafus) {
  const digits = snafu.split('');
  let whole = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    const power = digits.length - 1 - i;
    let num;
    switch (digits[i]) {
      case '0':
      case '1':
      case '2':
        num = Number(digits[i]);
        break;
      case '-':
        num = -1;
        break;
      case '=':
        num = -2;
        break;
    }
    whole += (num * Math.pow(5,power));
  }
  tot += whole;
}

const output = [];
let quotient = tot;
while(quotient) {
    const newQuotient = Math.floor(quotient / 5);
    const remainder = quotient % 5;
    quotient = newQuotient;
    if(remainder <= 2) {
        output.push(String(remainder));
    } else {
        quotient++;
        if(remainder === 3) {
            output.push('=');
        } else {
            output.push('-');
        }
    }
}

console.log(output.reverse().join(''));

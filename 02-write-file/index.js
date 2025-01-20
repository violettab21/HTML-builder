const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Input content:\n');
stdin.on('data', (data) => {
  let input = String(data);
  if (input.trim() !== 'exit') {
    output.write(input);
  } else process.exit();
});
process.on('exit', () =>
  stdout.write('Entering is finished, input is saved into text.txt!'),
);
process.on('SIGINT', () => {
  process.exit();
});

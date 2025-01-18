const path = require('path');
const fs = require('fs');
const { stdout, stdin } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');
const consoleExit = () => {
  stdout.write('Goodbye!\n');
  process.exit();
};

stdout.write('Write the text:\n');
stdin.on('data', (data) => {
  data.toString().trim() === 'exit' ? consoleExit() : writeStream.write(data);
});
process.on('SIGINT', consoleExit);

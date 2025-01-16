const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');
let result = '';

readStream.on('data', (chunk) => {
  result += chunk;
});
readStream.on('error', (err) => {
  console.log(err);
});
readStream.on('end', () => {
  console.log(result);
});

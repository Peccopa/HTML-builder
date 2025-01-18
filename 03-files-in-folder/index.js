const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');
fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      const fileParse = path.parse(filePath);
      fs.stat(filePath, (err, stats) => {
        const name = fileParse.name;
        const ext = fileParse.ext.slice(1);
        const size = (stats.size / 1024).toFixed(3);
        process.stdout.write(`${name} - ${ext} - ${size}kb\n`);
      });
    }
  });
});

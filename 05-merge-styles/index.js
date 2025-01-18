const path = require('path');
const fs = require('fs');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(bundlePath);

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile() && file.name.slice(-3) === 'css') {
      const filePath = path.join(stylesPath, file.name);
      const readStream = fs.createReadStream(filePath);
      readStream.on('data', (chunk) => writeStream.write(chunk));
    }
  });
});

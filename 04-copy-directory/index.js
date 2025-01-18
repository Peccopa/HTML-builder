const path = require('path');
const fs = require('fs');

const origPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

(function (origPath, copyPath) {
  fs.rm(copyPath, { recursive: true, force: true }, () => {
    fs.mkdir(copyPath, { recursive: true }, () => {});
    fs.readdir(origPath, (err, files) => {
      files.forEach((file) => {
        fs.copyFile(`${origPath}/${file}`, `${copyPath}/${file}`, () => {});
      });
    });
  });
})(origPath, copyPath);

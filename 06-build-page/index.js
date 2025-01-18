const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'project-dist');
const distAssetsPath = path.join(distPath, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(distPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');

(function createDist() {
  fs.mkdir(distPath, { recursive: true }, () => {
    fs.mkdir(distAssetsPath, { recursive: true }, () => {
      copyAssets();
      mergeStyles();
      mergeHTML();
    });
  });
})();

function copyAssets(defPath = path.join(__dirname, 'assets')) {
  fs.readdir(defPath, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      const curPath = path.join(defPath, file.name);
      if (file.isFile()) {
        const relPath = curPath.split('assets')[1];
        fs.copyFile(curPath, path.join(distAssetsPath, relPath), () => {});
      } else {
        fs.mkdir(
          path.join(distAssetsPath, file.name),
          { recursive: true },
          () => {},
        );
        copyAssets(curPath);
      }
    });
  });
}

function mergeStyles() {
  const styleCssPath = path.join(distPath, 'style.css');
  const writeStream = fs.createWriteStream(styleCssPath);
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      if (file.isFile() && file.name.slice(-3) === 'css') {
        const filePath = path.join(stylesPath, file.name);
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (chunk) => writeStream.write(chunk));
      }
    });
  });
}

function mergeHTML() {
  const readStream = fs.createReadStream(templatePath, 'utf-8');
  readStream.on('data', (data) => {
    let strData = data.toString();
    fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
      files.forEach((file) => {
        if (file.isFile() && file.name.slice(-4) === 'html') {
          const filePath = path.join(componentsPath, file.name);
          const componentName = `{{${file.name.replace('.html', '')}}}`;
          const readStream = fs.createReadStream(filePath, 'utf-8');
          readStream.on('data', (chunk) => {
            strData = strData.replaceAll(componentName, chunk);
            fs.writeFile(indexPath, strData, () => {});
          });
        }
      });
    });
  });
}

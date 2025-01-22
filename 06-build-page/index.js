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
      // mergeHTML();
      asyncMergeHTML();
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

async function asyncMergeHTML() {
  const templateHTML = await fs.promises.readFile(templatePath, 'utf-8');
  let indexHTML = await fs.promises.writeFile(indexPath, templateHTML);
  const components = await fs.promises.readdir(componentsPath, {
    withFileTypes: true,
  });
  for (let i = 0; i < components.length; i += 1) {
    let file = components[i];
    indexHTML = await fs.promises.readFile(indexPath, 'utf-8');
    if (file.isFile() && file.name.slice(-4) === 'html') {
      const filePath = path.join(componentsPath, file.name);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const componentName = `{{${components[i].name.replace('.html', '')}}}`;
      indexHTML = indexHTML.replaceAll(componentName, fileContent);
      await fs.promises.writeFile(indexPath, indexHTML);
    }
  }
}

// function mergeHTML() {
//   const readStream = fs.createReadStream(templatePath, 'utf-8');
//   readStream.on('data', (data) => {
//     let strData = data.toString();
//     fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
//       files.forEach((file) => {
//         // console.log(file);
//         if (file.isFile() && file.name.slice(-4) === 'html') {
//           const filePath = path.join(componentsPath, file.name);
//           const readStream = fs.createReadStream(filePath, 'utf-8');
//           readStream.on('data', (chunk) => {
//             const componentName = `{{${file.name.replace('.html', '')}}}`;
//             strData = strData.replaceAll(componentName, chunk);
//             fs.writeFile(indexPath, strData, () => {});
//           });
//         }
//       });
//     });
//   });
// }

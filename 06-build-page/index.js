const fs = require('fs');
const path = require('path');

//create folder

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) console.log(err);
});
let template = '';
//read the content of template
function readTemplate() {
  let input = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  input.on('data', (chunk) => (template += chunk));
  input.on('end', () => {
    let re = /(?<=\{{).*?(?=\}})/gi;
    //find tags in the template
    let componentsForInsert = template.match(re);
    //read content of components files and replace template tag with content, write in the file
    transform(componentsForInsert);
  });
}
function transform(components) {
  components.forEach((component, i) => {
    let componentFileInput = fs.createReadStream(
      path.join(__dirname, 'components', `${component}.html`),
      'utf-8',
    );
    let componentFileData = '';
    componentFileInput.on('data', (chank) => (componentFileData += chank));
    componentFileInput.on('end', () => {
      template = template.replace(`{{${component}}}`, componentFileData);
    });
    componentFileInput.on('close', () => {
      let finalFile = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
        'utf-8',
      );
      finalFile.write(template);
    });
  });
}
readTemplate();
//create css
const outputStyle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) console.log(err);
        else {
          if (stats.isFile() && path.extname(file) === '.css') {
            const inputStyle = fs.createReadStream(
              path.join(__dirname, 'styles', file),
            );
            inputStyle.on('data', (chunk) => outputStyle.write(chunk));
          }
        }
      });
    });
  }
});

//copy files from assets

function createFolder(destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) console.log(err);
  });
}

function copyFolderContent(from, to) {
  fs.readdir(path.join(__dirname, ...from), (err, files) => {
    if (err) console.log(err);
    else {
      let filesOrigin = [];
      files.forEach((file) => {
        filesOrigin.push(file);
        fs.copyFile(
          path.join(__dirname, ...from, file),
          path.join(__dirname, ...to, file),
          (err) => {
            if (err) console.log(err);
          },
        );
      });

      fs.readdir(path.join(__dirname, ...to), (err, files) => {
        if (err) console.log(err);
        else {
          let filesCopied = [];
          files.forEach((file) => {
            filesCopied.push(file);
          });
          filesCopied.forEach((el) => {
            if (filesOrigin.indexOf(el) === -1) {
              fs.rm(path.join(__dirname, ...to, el), (err) => {
                if (err) console.log(err);
              });
            }
          });
        }
      });
    }
  });
}

createFolder(path.join(__dirname, 'project-dist', 'assets'));

fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      createFolder(path.join(__dirname, 'project-dist', 'assets', file));
      copyFolderContent(['assets', file], ['project-dist', 'assets', file]);
    });
  }
});

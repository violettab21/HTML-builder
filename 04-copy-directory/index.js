const fs = require('fs');
const path = require('path');
copyDir('files', 'files-copy');
function copyDir(from, to) {
  fs.mkdir(path.join(__dirname, to), { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  fs.readdir(path.join(__dirname, from), (err, files) => {
    if (err) console.log(err);
    else {
      let filesOrigin = [];
      files.forEach((file) => {
        filesOrigin.push(file);
        fs.copyFile(
          path.join(__dirname, from, file),
          path.join(__dirname, to, file),
          (err) => {
            if (err) console.log(err);
          },
        );
      });
      fs.readdir(path.join(__dirname, to), (err, files) => {
        if (err) console.log(err);
        else {
          let filesCopied = [];
          files.forEach((file) => {
            filesCopied.push(file);
          });
          filesCopied.forEach((el) => {
            if (filesOrigin.indexOf(el) === -1) {
              fs.rm(path.join(__dirname, to, el), (err) => {
                if (err) console.log(err);
              });
            }
          });
        }
      });
    }
  });
}

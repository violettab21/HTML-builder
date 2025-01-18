const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) console.log(err);
});

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err) console.log(err);
  else {
    let filesOrigin = [];
    files.forEach((file) => {
      filesOrigin.push(file);
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        (err) => {
          if (err) console.log(err);
        },
      );
    });
    console.log(filesOrigin);
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
      if (err) console.log(err);
      else {
        let filesCopied = [];
        files.forEach((file) => {
          filesCopied.push(file);
        });
        filesCopied.forEach((el) => {
          if (filesOrigin.indexOf(el) === -1) {
            console.log(el);
            fs.rm(path.join(__dirname, 'files-copy', el), (err) => {
              if (err) console.log(err);
            });
          }
        });
      }
    });
  }
});

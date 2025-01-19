const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) console.log(err);
        else {
          if (stats.isFile() && path.extname(file) === '.css') {
            const input = fs.createReadStream(
              path.join(__dirname, 'styles', file),
            );
            input.on('data', (chunk) => output.write(chunk));
          }
        }
      });
    });
  }
});

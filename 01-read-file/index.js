const fs = require('fs');
const path = require('path');

const read = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
read.on('data', (chunk) => console.log(chunk));

const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

let fullData = '';
readStream.on('data', chunk => fullData += chunk);
readStream.on('start', (message) => console.log(message));
readStream.on('end', () => {
  console.log(fullData);
  console.log('End reading!');
});
readStream.on('error', error => console.error(error.message));

readStream.emit('start', 'Start reading!');
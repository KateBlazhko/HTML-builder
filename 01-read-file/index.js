const fs = require('fs');
const { join } = require('path');
const { stdout } = require('process');

const pathToFile = join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToFile, 'utf8');

readStream.on('start', (message) => console.log(message));
readStream.emit('start', 'Start reading!');

readStream.on('data', chunk => stdout.write(chunk));

readStream.on('end', () => console.log('End reading!'));

readStream.on('error', error => console.error(error.message));

// Реализация через pipe:
// readStream.pipe(stdout)
// readStream.on('error', error => console.error(error.message));
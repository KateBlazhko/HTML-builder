const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const rl = readline.createInterface(stdin, stdout);

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

function checkData(data) {
  const stringData = data.toString();
  console.log();
  return (stringData === 'exit') ? true : false;
}

fs.access(path.join(__dirname, 'text.txt'), error => {
  if (error) {
    fs.writeFile(
      path.join(__dirname, 'text.txt'),
      '',
      error => {
        if (error) return console.error(error.message);
      }
    );
    console.log('file "text.txt" create');
  } else {
    console.log('file "text.txt" exist');
  }

  console.log('Hello, please enter text for writtting');
  rl.on('line', data => {
    const isExit = checkData(data);

    if (isExit) return writeStream.emit('end')

    writeStream.write(data + '\n');
    return stdout.write('Add text for writting\n');
  });
  
  rl.on('SIGINT', () => {
    stdout.write('exit\n')
    writeStream.emit('end'); 
  });
  
  writeStream.on('end', () => {
    stdout.write('Your file is ready!\n');
    exit();
  });

  writeStream.on('error', error => console.error(error.message));
});




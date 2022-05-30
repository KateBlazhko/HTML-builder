const { join } = require('path');
const { stdin, stdout, exit, platform } = require('process');
const { access, writeFile } = require('fs/promises');
const readline = require('readline');
const fs = require('fs');

const pathToFile = join(__dirname, 'text.txt');
const rl = readline.createInterface(stdin, stdout);
const writeStream = fs.createWriteStream(pathToFile, 'utf-8');

const message = 
`\nВнимание! В Git Bash для Windows версий 2.35.1-2.35.4 присутствует баг, 
          при котором некорректно обрабатывается событие при нажатии сочетания клавиш Ctrl+C. 
          В связи с этим в задаче может не показываться прощальное сообщение 
          при нажатии данного сочетания клавиш. 
          Обновите Git Bash или попробуйте запускать скрипт в другом терминале\n`
          
if (platform.match(/win/i)) {
  console.log(message)
}

function checkData(data) {
  const stringData = data.toString();
  console.log();
  return (stringData === 'exit') ? true : false;
}

async function checkFile(pathToFile) {
  try {
    await access(pathToFile)
    return true
  } catch {
    return false
  }
}

async function createFile() {
  try {
    await writeFile(pathToFile, '')
  } catch {
    console.error(error.message);
  }
}

function addHandlers() {
  console.log('Hello, please type some text');

  rl.on('line', data => {
    const isExit = checkData(data.trim());

    if (isExit) return writeStream.emit('end')

    writeStream.write(data + '\n');
    return stdout.write('Would you like to continue typing?\n');
  });
  
  rl.on('SIGINT', () => {
    stdout.write('\n')
    writeStream.emit('end'); 
  });

  writeStream.on('end', () => {
    stdout.write('Your file is ready!\n');
    exit();
  });

  writeStream.on('error', error => console.error(error.message));
  rl.on('error', error => console.error(error.message));
}

(async () => {
    try {
      const isExistFile = await checkFile(pathToFile);

      if (!isExistFile) {
        await createFile();
      }
      
      addHandlers();

    } catch {
      console.error(error.message);
    }
})()
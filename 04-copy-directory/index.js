const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { mkdir, rm, readdir } = require('fs/promises');

const message = 
`\nВнимание! В Windows присутствует баг, 
          при котором некорректно обрабатывает fs.rm() при включенном Live Server'e. 
          В связи с этим прошу убедиться, что LS выключен\n`

if (process.platform.match(/win/i)) {
  console.log(message)
}

async function createFolder(pathFolder) {
  try {
    await mkdir(pathFolder, { recursive: true });
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFolder(pathDist, pathSrc) {
  try {
    await createFolder(pathDist);

    const files = await readdir(pathSrc, { withFileTypes: true});

    files.forEach(file => {

      if(file.isFile()) {
        const readStream = createReadStream(path.join(pathSrc, `${file.name}`));
        const writeStream = createWriteStream(path.join(pathDist, `${file.name}`));

        readStream.pipe(writeStream);

        readStream.on('error', error => console.error(error.message));
        writeStream.on('error', error => console.error(error.message));
        
      } else {
        copyFolder(path.join(pathDist, `${file.name}`), path.join(pathSrc, `${file.name}`),);
      }
      
    });

  } catch (error) {
    console.error(error.message);
  } 
}

(async () => {
  try {
    const pathDist = path.join(__dirname, 'files-copy');
    const pathSrc = path.join(__dirname, 'files');

    await rm(pathDist, { recursive: true, force: true });
    await copyFolder(pathDist, pathSrc);

    return console.log('Your folder is copied');

  } catch (error) {
    console.error(error.message);
  }
})()
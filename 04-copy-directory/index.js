const path = require('path');
const { readdir, createReadStream, createWriteStream } = require('fs');
const { mkdir, rm } = require('fs/promises');

const message = 
`\nВнимание! В Windows присутствует баг, 
          при котором некорректно обрабатывает fs.rm() при включенном Live Server'e. 
          В связи с этим прошу убедиться, что LS выключен\n`

if (process.platform.match(/win/i)) {
  console.log(message)
}

function copyFolder(pathDist, pathSrc) {
  readdir(pathSrc, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error.message);

    files.forEach(file => {

      if(file.isFile()) {
        const readStream = createReadStream(path.join(pathSrc, `${file.name}`));

        const writeStream = createWriteStream(path.join(pathDist, `${file.name}`));

        readStream.pipe(writeStream);

        readStream.on('error', error => console.error(error.message));

        writeStream.on('close', () => {
          console.log(`file ${file.name} copied`);
        });

        writeStream.on('error', error => console.error(error.message));
        
      } else {
        createFolder(path.join(pathDist, `${file.name}`), path.join(pathSrc, `${file.name}`));
      }
      
    });
  });
}

function createFolder(pathDist, pathSrc) {
  mkdir(pathDist, { recursive: true })
    .then(copyFolder(pathDist, pathSrc))
    .catch(error => console.error(error.message));

}

rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true , maxRetries: 100})
  .then(() => {

    createFolder(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));
    
  })
  .catch(error => console.error(error.message));
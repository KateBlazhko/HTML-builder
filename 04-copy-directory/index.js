const path = require('path')

const { readdir, writeFile, readFile, unlink } = require('fs')

const { mkdir } = require('fs/promises');

function cleanFolder(pathFolder) {
  readdir(pathFolder, (error, files) => {
    if (error) return console.error(error.message);

    files.forEach(file => unlink(path.join(pathFolder, file), error => {
      if (error) return console.error(error.message);
    }));

    copyFolder();
  })
}

function copyFolder() {
  readdir(path.join(__dirname, 'files'), (error, files) => {
    if (error) return console.error(error.message);

    files.forEach(file => {
      readFile(path.join(__dirname, 'files', `${file}`), (error, data) => {
        if (error) return console.error(error.message);

        writeFile(path.join(__dirname, 'files-copy', `${file}`), data, error => {
          if (error) return console.error(error.message);

          console.log(`file ${file} copied`)
        })
      })
    })
  })
}

mkdir(path.join(__dirname, 'files-copy'), { recursive: true })
  .then(cleanFolder(path.join(__dirname, 'files-copy')))
  .catch(error => console.error(error.message))


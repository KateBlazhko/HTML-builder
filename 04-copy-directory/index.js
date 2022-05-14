const path = require('path')

const { readdir, writeFile, readFile } = require('fs')

const { mkdir, rm } = require('fs/promises');

const options = { withFileTypes: true };


function copyFolder(pathDist, pathSrc) {
  readdir(pathSrc, options, (error, files) => {
    if (error) return console.error(error.message);

    files.forEach(file => {

      if(file.isFile()) {
        readFile(path.join(pathSrc, `${file.name}`), (error, data) => {
          if (error) return console.error(error.message);
  
          writeFile(path.join(pathDist, `${file.name}`), data, error => {
            if (error) return console.error(error.message);
  
            console.log(`file ${file.name} copied`)
          })
        })
      } else {
        createFolder(path.join(pathDist, `${file.name}`), path.join(pathSrc, `${file.name}`))
      }
      
    })
  })
}

function createFolder(pathDist, pathSrc) {
  mkdir(pathDist, { recursive: true })
    .then(copyFolder(pathDist, pathSrc))
    .catch(error => console.error(error.message))

}

rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true })
  .then(() => {

    createFolder(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'))
    
  })
  .catch(error => console.error(error.message))
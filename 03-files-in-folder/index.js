const { stat, readdir } = require('fs');
const { join, extname, basename } = require('path');

const pathToFile = join(__dirname, 'secret-folder')

readdir(pathToFile, { withFileTypes: true }, (error, files) => {

  if (error) return console.error(error.message);

  const listFiles = files.filter(file => file.isFile()).map(file => file.name);

  listFiles.forEach(file => {

    stat(join(pathToFile, `${file}`), (error, stats) => {

      if(error) return console.error(error.message);

      const extFile = extname(`${file}`)
      const nameFile = basename(`${file}`, extname(`${file}`))
      const weightFile = stats.size;

      console.log(`${nameFile} - ${extFile.slice(1)} - ${weightFile / 1024}kB`);
    });
  });
});
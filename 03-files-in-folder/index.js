const { stat, readdir } = require('fs');
const path = require('path');

const regExp = /(\w+).(\w+)/i;

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (error, files) => {
  if (error) return console.error(error.message);
  const listFiles = files.filter(file => file.isFile()).map(file => file.name);

  listFiles.forEach(file => {
    stat(path.join(__dirname, 'secret-folder', `${file}`), (error, stats) => {
      if(error) return console.error(error.message);

      const nameFile = file.replace(regExp, '$1');
      const extFile = file.replace(regExp, '$2');
      const weightFile = stats.size;
      console.log(`${nameFile} - ${extFile} - ${weightFile / 1024}kb`);
    });
  });
});
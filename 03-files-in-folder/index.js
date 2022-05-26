const { stat, readdir } = require('fs');
const path = require('path');

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (error, files) => {
  if (error) return console.error(error.message);
  const listFiles = files.filter(file => file.isFile()).map(file => file.name);

  listFiles.forEach(file => {
    stat(path.join(__dirname, 'secret-folder', `${file}`), (error, stats) => {
      if(error) return console.error(error.message);

      const extFile = path.extname(`${file}`)
      const nameFile = path.basename(`${file}`, path.extname(`${file}`))
      const weightFile = stats.size;
      console.log(`${nameFile} - ${extFile.slice(1)} - ${weightFile / 1024}kB`);
    });
  });
});
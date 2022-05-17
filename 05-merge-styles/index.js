const path = require('path');
const { readdir, createReadStream, createWriteStream} = require('fs');

readdir(path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (error, files) => {
    if (error) return console.error(error.message);
    
    const listCSSFiles = files.filter(file => {
      if (file.isFile && file.name.match(/.css/i)) {
        return true
      }
      return false
    })

    const promisesReading = []
    
    listCSSFiles.forEach(file =>{
      promisesReading.push(new Promise((resolve, reject) => {
        const readStream = createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8')
        const style = []
  
        readStream.on('data', data => style.push(data))
        readStream.on('end', () => {
          resolve(...style)
        })
        readStream.on('error', reject);
      }))
    })

    Promise.all(promisesReading)
        .then(styles  => {
          const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'),
            'utf-8')
          writeStream.write(styles.join('\n'), error => {
            if (error) return console.error(error.message);
              writeStream.emit('end')
            })
          writeStream.on('end', () => {
            console.log('Your styles are ready!')
          })
          writeStream.on('error', error => console.error(error.message));
        })
        .catch(error => console.error(error.message));

  })
const path = require('path');
const { readdir, createReadStream, createWriteStream} = require('fs')

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

    const styles = []
    
    listCSSFiles.forEach(file =>{
      const readStream = createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8')
      const style = []

      readStream.on('data', data => style.push(data))
      readStream.on('end', () => {
        styles.push(...style)

        if (styles.length === listCSSFiles.length) {
          readStream.emit('fullend')
        }
      });

      readStream.on('fullend', () => {
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
      
      readStream.on('error', error => console.error(error.message));

    })
  })
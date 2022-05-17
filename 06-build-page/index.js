const path = require('path');
const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream, readFile  } = require('fs');
const readline = require('readline');

// Create Html
function readTemplate(listHtmlFiles) {
  readFile(path.join(__dirname, 'template.html'), (error, data) => {
    if(error) return console.error(error.message);
    
    let templateHtml = data.toString()

    readHTMLFiles(listHtmlFiles, templateHtml)
      .then((mainHtml) => createIndexHtml(mainHtml))
      .catch(error => console.error(error.message));
    
  })
}

async function readHTMLFiles(listHtmlFiles, templateHtml) {
  try {

    if (listHtmlFiles.length === 0) {
      return templateHtml
    } 
  
    const regExpName = /(\w+).(\w+)/i;
    const file = listHtmlFiles[0];
    const nameFile = file.name.replace(regExpName, '$1');
    const regExp = new RegExp(`(\\s*){{${nameFile}}}`);
    const spaces = templateHtml.match(regExp)[1];
    
    const result = await new Promise((resolve, reject) => {
      const readStream = createReadStream(path.join(__dirname, 'components', file.name), 'utf8')
      const rl = readline.createInterface(readStream);
  
      let data = '';
      rl.on('line', chunk => data += spaces + chunk)
  
      rl.on('close', () => {
        templateHtml = templateHtml.replace(regExp, data);
        resolve(templateHtml)
      })

      rl.on('error', reject)
    })
  
    templateHtml = readHTMLFiles(listHtmlFiles.slice(1), result)
    return templateHtml
    
  } catch (error) {
    console.error(error.message);
  }
  
}

function createIndexHtml(mainHtml) {
  const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'),
    'utf-8');

  writeStream.write(mainHtml, error => {
    if (error) return console.error(error.message);
    writeStream.emit('end')
  })

  writeStream.on('end', () => {
    console.log('Your index.html is ready!')
  })
  writeStream.on('error', error => console.error(error.message));
}

readdir(path.join(__dirname, 'components'), { withFileTypes: true })
  .then(files => {
    const listHtmlFiles = files.filter(file => file.name.match(/.html/i))

    readTemplate(listHtmlFiles)
  })
  .catch(error => console.error(error.message));
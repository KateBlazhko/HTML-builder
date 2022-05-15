const path = require('path');
const { readdir } = require('fs/promises');
const { error } = require('console');
const { createReadStream, createWriteStream, readFile  } = require('fs');
const readline = require('readline');

function readTemplate(listHtmlFiles) {
  readFile(path.join(__dirname, 'template.html'), (error, data) => {
    if(error) return console.error(error.message);
    
    let mainHtml = data.toString()
    const regExpName = /(\w+).(\w+)/i;

    readHTMLFiles(listHtmlFiles, mainHtml)

    // listHtmlFiles.forEach(file => { 

    //   const readStream = createReadStream(path.join(__dirname, 'components', file.name), 'utf8')

    //   let data = '';
    //   readStream.on('data', chunk => data += chunk)


    //   readStream.on('end', () => {
    //     const nameFile = file.name.replace(regExpName, '$1');
    //     const regExp = new RegExp(`{{${nameFile}}}`);

    //     mainHtml = mainHtml.replace(regExp, data);
    //     console.log(mainHtml)

    //   })

    //   readStream.on('fullend', () => {

    //     const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'),
    //       'utf-8');

    //     writeStream.write(mainHtml, error => {
    //       if (error) return console.error(error.message);
    //       writeStream.emit('end')
    //     })

    //     writeStream.on('end', () => {index.html
    //       console.log('Your index.html is ready!')
    //     })
    //     writeStream.on('error', error => console.error(error.message));

    //   })

    //   readStream.on('error', error => console.error(error.message));

    // });
  })
  
  // const readStream = createReadStream(path.join(__dirname, 'template.html'), 'utf8')
  // const rl = readline.createInterface(readStream);

  // rl.on('line', data => {

  //   if(data.toString().includes('header')) console.log(data)
  // })
  // rl.on('error', error => console.error(error.message))
}

function readHTMLFiles(listHtmlFiles, mainHtml) {

  if (listHtmlFiles.length === 0) {
    createIndexHtml(mainHtml)
    return 
  } 

  const regExpName = /(\w+).(\w+)/i;
  const file = listHtmlFiles[0];
  const nameFile = file.name.replace(regExpName, '$1');
  const regExp = new RegExp(`(\\s*){{${nameFile}}}`);
  const spaces = mainHtml.match(regExp)[1];
  
  const readStream = createReadStream(path.join(__dirname, 'components', file.name), 'utf8')
  const rl = readline.createInterface(readStream);

  let data = '';
  rl.on('line', chunk => data += spaces + chunk)

  rl.on('close', () => {
    mainHtml = mainHtml.replace(regExp, data);
    readHTMLFiles(listHtmlFiles.slice(1), mainHtml)
    return 
  })

  rl.on('error', error => console.error(error.message))


    //   readStream.on('fullend', () => {

    //     const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'),
    //       'utf-8');

    //     writeStream.write(mainHtml, error => {
    //       if (error) return console.error(error.message);
    //       writeStream.emit('end')
    //     })

    //     writeStream.on('end', () => {index.html
    //       console.log('Your index.html is ready!')
    //     })
    //     writeStream.on('error', error => console.error(error.message));

    //   })

    //   readStream.on('error', error => console.error(error.message));


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
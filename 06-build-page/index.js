const path = require('path');
const { readdir, readFile, mkdir, rm } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const readline = require('readline');

//Create any folder
async function createFolder(pathFolder) {
  try {
    await mkdir(pathFolder, { recursive: true });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

//Create 'index.html'
async function readComponents(pathComponents) {
  try {
    const files = await readdir(pathComponents, { withFileTypes: true });
    const listHtmlFiles =  files.filter(file => file.isFile() && file.name.match(/.html/i));

    return listHtmlFiles;

  } catch (error) {
    console.error(error.message);
  } 
}

async function readTemplate() {
  try {
    const data = await readFile(path.join(__dirname, 'template.html'));
    const templateHtml = data.toString();

    return templateHtml;
      
  } catch (error) {
    console.error(error.message);
  }
}

async function readHTMLFiles(listHtmlFiles, templateHtml) {
  try {

    if (listHtmlFiles.length === 0) {
      return templateHtml;
    } 

    const file = listHtmlFiles[0].name;
    const nameFile = path.basename(`${file}`, path.extname(`${file}`))

    const regExp = new RegExp(`(\\s*){{${nameFile}}}`);
    const result = await new Promise((resolve, reject) => {

      const readStream = createReadStream(path.join(__dirname, 'components', file));
      const rl = readline.createInterface(readStream);

      const spaces = (templateHtml.match(regExp)) ? templateHtml.match(regExp)[1] : '';

      let data = '';
      rl.on('line', chunk => data += spaces + chunk);
  
      rl.on('close', () => {
        templateHtml = templateHtml.replace(regExp, data);
        resolve(templateHtml);
      });

      rl.on('error', reject);
    });
  
    templateHtml = readHTMLFiles(listHtmlFiles.slice(1), result);
    return templateHtml;
    
  } catch (error) {
    console.error(error.message);
  }  
}

async function createIndexHtml() {
  try {
    const listHtmlFiles = await readComponents(path.join(__dirname, 'components'));
    const templateHtml = await readTemplate();
    const indexHtml = await readHTMLFiles(listHtmlFiles, templateHtml);
    
    await new Promise ((resolve, reject) => {
      const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  
      writeStream.write(indexHtml, () => {
        writeStream.end();
      });
  
      writeStream.on('finish', () => {
        console.log('Your index.html is ready!');
        resolve();
      });
  
      writeStream.on('error', reject);
  
    });
  } catch (error) {
    console.error(error.message);
  }
}

//Create 'style.css'
async function createStyleCss() {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
     
    const listCSSFiles = files.filter(file => {
      if (file.isFile() && file.name.match(/.css/i)) {
        return true;
      }
      return false;
    });

    const promisesReading = listCSSFiles.map(file => {
      return new Promise((resolve, reject) => {
        const readStream = createReadStream(path.join(__dirname, 'styles', `${file.name}`));
        const style = [];
  
        readStream.on('data', data => style.push(data));
        readStream.on('end', () => {
          resolve(...style);
        });
        readStream.on('error', reject);
      });
    });
    
    const styles = await Promise.all(promisesReading);

    const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

    writeStream.write(styles.join('\n'), error => {
      if (error) throw error;

      writeStream.emit('end');
    });

    writeStream.on('end', () => {
      console.log('Your style.css is ready!');
    });

    writeStream.on('error', error => {
      if (error) throw error;
    });

  } catch (error) {
    console.error(error.message);
  }  
}

//Create 'assets'
async function createAssets() {
  try {
    const pathDist = path.join(__dirname, 'project-dist', 'assets');
    const pathSrc = path.join(__dirname, 'assets');
    
    await rm(pathDist, { recursive: true, force: true });
    await copyFolder(pathDist, pathSrc);

    return console.log('Your folder "assets" is ready');

  } catch (error) {
    console.error(error.message);
  }
}

async function copyFolder(pathDist, pathSrc) {
  try {
    await createFolder(pathDist);

    const files = await readdir(pathSrc, { withFileTypes: true});

    files.forEach(file => {

      if(file.isFile()) {
        const readStream = createReadStream(path.join(pathSrc, `${file.name}`));
        const writeStream = createWriteStream(path.join(pathDist, `${file.name}`));

        readStream.pipe(writeStream);

        readStream.on('error', error => console.error(error.message));
        writeStream.on('error', error => console.error(error.message));
        
      } else {
        copyFolder(path.join(pathDist, `${file.name}`), path.join(pathSrc, `${file.name}`),);
      }
      
    });

  } catch (error) {
    console.error(error.message);
  } 
}

createFolder(path.join(__dirname, 'project-dist'))
  .then((isCreate) => {
    if (isCreate) {
      createIndexHtml();
      createStyleCss();
      createAssets();
    }
  })
  .catch(error => console.error(error.message));

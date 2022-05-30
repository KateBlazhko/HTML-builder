const { join } = require('path');
const { createReadStream, createWriteStream} = require('fs');
const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');

const pathDist = join(__dirname, 'project-dist', 'bundle.css');
const pathSrc = join(__dirname, 'styles');

async function createStyleCss() {
  try {
    const files = await readdir(pathSrc, { withFileTypes: true });
     
    const listCSSFiles = files.filter(file => {
      if (file.isFile() && file.name.match(/.css/i)) {
        return true;
      }
      return false;
    });

    for (const file of listCSSFiles) {
      const readStream = createReadStream(join(pathSrc, file.name));
      const writeStream = createWriteStream(pathDist, { flags: 'a' });

      await pipeline(readStream, writeStream)
    }

    console.log('Your style.css is ready!');

  } catch (error) {
    console.error(error.message);
  }  
}

createStyleCss();
const fs = require("fs");
const path = require("path");

const gimmeFlat = require("./array");
gimmeFlat();

const walkDir = (dir, fileTypes)=>
  fs.readdirSync(dir)
  .map (file => {
    const currentFile = path.join(dir, file);
    if (fs.statSync(currentFile).isFile() && fileTypes.indexOf(path.extname(currentFile)) != -1)
      return [currentFile]
    else if (fs.statSync(currentFile).isDirectory())
      return walkDir(currentFile, fileTypes)
    return []
  })
  .flat() ;

const entryFrom = (dir, files)=>
  files.reduce( (obj, filePath) => {
    const entryChunkName = filePath.replace(path.extname(filePath), "").replace(dir, "");
    obj[entryChunkName] = `./${filePath}`;
    return obj;
  }, {});

module.exports = { walkDir, entryFrom };

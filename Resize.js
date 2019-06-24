const sharp = require('sharp');
const uuidv4 = require('uuid/v4');

class Resize {

  constructor(destFolder) {
    this.destFolder = destFolder;
  }

  async saveThumbnail(initialFilePath) {
    const fileName = Resize.fileName();
    const filePath = this.filePath(fileName);

    await sharp(initialFilePath)
    .rotate() // auto-rotated using EXIF Orientation tag
    .resize({
      width: 200,
      height: 200,
      fit: sharp.fit.cover // crop to cover both provided dimensions
    })
    .png()
    .toFile(filePath);

    return fileName;
  }

  static fileName() {
    return `${uuidv4()}.png`;
  }

  filePath(fileName) {
    return `${this.destFolder}/${fileName}`;
  }
}

module.exports = Resize;
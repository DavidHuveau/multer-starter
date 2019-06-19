const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const uuidv4 = require("uuid/v4");

const fileFilter = (req, file, cb) => {
    // supported image file mimetypes
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedMimes.includes(file.mimetype)) {
      req.fileValidationError = "goes wrong on the mimetype...";
      // return cb(new Error("goes wrong on the mimetype"));
      return cb(null, false);
    }
    cb(null, true);
}

const upload = multer({
  dest: "tmp/",
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: fileFilter
});

router
  .route("/")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="resize">
      <input type="file" name="myFile" accept="image/jpeg, image/png, image/gif">
      <button>Send</button>
      </form>`
    );
  })
  .post(
    upload.single("myFile"),
    (req, res) => {
      const { file } = req;
      // console.log(file);

      if (req.fileValidationError)
        res.end(req.fileValidationError);
      else {
        const newPath = `public/thumbnails/${uuidv4()}.png`;
        sharp(file.path)
          .rotate() // auto-rotated using EXIF Orientation tag
          .resize({
            width: 200,
            height: 200,
            fit: sharp.fit.cover // crop to cover both provided dimensions
          })
          .png()
          .toFile(newPath, err => {
            if (err) throw err;
            res.json(newPath);
          });
      }

    });

module.exports = router;

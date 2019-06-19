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
      console.log(file);

      if (req.fileValidationError)
        res.end(req.fileValidationError);
      else {
        const newPath = `public/thumbnails/${uuidv4()}.png`;
        sharp(file.path)
          .rotate()
          .resize(200)
          .png()
          .toFile(newPath, err => {
            if (err)
              res.send(err)
            else
              res.end("File uploaded successfully");
          });
      }

    });

module.exports = router;

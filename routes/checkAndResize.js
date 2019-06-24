const express = require("express");
const router = express.Router();
const multer = require("multer");
const Resize = require('../Resize');

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
    async (req, res) => {
      // console.log(file);
      const { file } = req;

      if (req.fileValidationError)
        res.status(401).json({error: req.fileValidationError});
      else if(!file)
        res.status(401).json({error: 'Please provide an image'});
      else {
        const destFolder = "public/thumbnails/";
        const resizer = new Resize(destFolder);
        const filename = await resizer.saveThumbnail(file.path);
        return res.json({ name: filename });
      }

    }
  );

module.exports = router;

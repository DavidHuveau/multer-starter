const express = require("express");
const router = express.Router();
const multer = require("multer");

// multers disk storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname.split(".")[0]}-${Date.now()}.${
        file.originalname.split(".").pop()}`
    );
  }
});

const fileFilter = (req, file, cb) => {
    // supported image file mimetypes
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedMimes.includes(file.mimetype)) {
      req.fileValidationError = "goes wrong on the mimetype...";
      // return cb(new Error("goes wrong on the mimetype"));
      return cb(null, false);
    }
    cb(null, true);
}

const upload = multer({
  dest: "tmp/",
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: fileFilter
});

router
  .route("/")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="check">
      <input type="file" name="myFiles" accept="image/jpeg, image/png, image/gif" multiple>
      <button>Send</button>
      </form>`
    );
  })
  .post(upload.array("myFiles", 3), (req, res) => {
    console.log(req.files);
    if (req.fileValidationError)
      res.end(req.fileValidationError);
    else
      res.end("File(s) uploaded successfully");
  });

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "tmp/" });

const MAX_NUMBER_OF_DOWNLOADED_FILES = 3;

router
  .route("/single")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="single">
      <input type="file" name="myFile" accept="image/png">
      <button>Send</button>
      </form>`
    );
    res.end();
  })
  .post(upload.single("myFile"), (req, res) => {
    console.log(req.file);
    fs.rename(req.file.path, "public/images/" + req.file.originalname, err => {
      if (err)
        res.send("Problem while uploading");
      else
        res.send("File uploaded successfully");
    });
  });

router
  .route("/multiple")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="multiple">
      <input type="file" name="myFiles" accept="image/png" multiple>
      <button>Send</button>
      </form>`
    );
    res.end();
  })
  .post(upload.array("myFiles", MAX_NUMBER_OF_DOWNLOADED_FILES), (req, res) => {
    console.log(req.files);
    req.files.forEach(file => {
      fs.rename(file.path, "public/images/" + file.originalname, err => {
        if (err) throw err;
      });
    });
    res.end("File(s) uploaded successfully");
  });

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  // multers disk storage settings
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname.split(".")[0]}-${Date.now()}${
        file.originalname.split(".")[1]
      }`
    );
  }
});

const upload = multer({
  dest: "tmp/",
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.includes("image/png")) {
      req.fileValidationError = "goes wrong on the mimetype...";
      // return cb(new Error("goes wrong on the mimetype"));
      return cb(null, false);
    }
    cb(null, true);
  }
});

router
  .route("/")
  .get((req, res) => {
    res.send(
      `<form method="POST" enctype="multipart/form-data" action="checkupload">
    <input type="file" name="mesfichiers" accept="image/png" multiple>
    <button> envoyer </button>
    </form>`
    );
  })
  .post(upload.array("mesfichiers", 3), (req, res) => {
    // console.log(req.files);
    if (req.fileValidationError) res.end(req.fileValidationError);
    else res.end("Fichier(s) uploadé(s) avec succès");
  });

module.exports = router;

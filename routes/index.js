const express = require("express");
const router = express.Router();

// GET home page
router.route("/").get((req, res) => {
  res.end("home");
});

module.exports = router;

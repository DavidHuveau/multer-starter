const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");

const SERVER_PORT = 8000;

app.use(logger("dev"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/", require("./routes"));
app.use("/basic", require("./routes/basicUpload"));
app.use("/check", require("./routes/checkUpload"));
app.use("/resize", require("./routes/checkAndResize"));

// The 404 Route (ALWAYS Keep this as the last route)
app.use((req, res) => {
  res.status(404).send('Sorry cant find that!');
});

app.listen(SERVER_PORT, err => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.log(`web server listening on port ${SERVER_PORT}`);
});
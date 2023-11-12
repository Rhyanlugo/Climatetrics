const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.get("/", (req, res) => {
  return res.json("Hello from express!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});

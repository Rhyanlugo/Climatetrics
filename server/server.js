import bodyParser from "body-parser";

import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "./configs/dbConfig.js";

let PORT;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

router.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server in ${process.env.STATUS} mode, listening on port: (${PORT}).`);
});

// Database functions
// TODO: MOVE TO SEPARATE FILES
const doRelease = (connection) => {
  connection.release((err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

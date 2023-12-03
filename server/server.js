import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import industryOverTimeRouter from "./routes/industryOverTime.js";
import menuDisplayRouter from "./routes/menuDisplay.js";

dotenv.config();
const app = express();

let PORT;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));
app.use("/industryOverTime", industryOverTimeRouter);
app.use("/menuDisplay", menuDisplayRouter);

app.listen(PORT, () => {
  console.log(`Server in ${process.env.STATUS} mode, listening on port: (${PORT}).`);
});

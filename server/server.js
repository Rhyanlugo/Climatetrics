import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import menuDisplayRouter from "./routes/menuDisplay.js";
import industryRatioByCountriesRouter from "./routes/complexQueries/industryCO2RatioByCountries.js";
import industryRatioByContinentRouter from "./routes/complexQueries/industryCO2RatioByContinent.js";
import annualTemperatureChangeByCountriesRouter from "./routes/complexQueries/annualTemperatureChangeByCountries.js";
import airportWeatherSeverity from "./routes/complexQueries/airportsWeatherSeverity.js";

dotenv.config();
const app = express();

let PORT;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

// Routes
app.use("/menuDisplay", menuDisplayRouter); // Routes for menus
app.use("/industryByCountries", industryRatioByCountriesRouter); // Complex Query 1
app.use("/industryByContinent", industryRatioByContinentRouter); // Complex Query 2
app.use("/annualTemperatureChange", annualTemperatureChangeByCountriesRouter); // Complex Query 3
app.use("/airportWeatherSeverity", airportWeatherSeverity); // Complex Query 4

app.listen(PORT, () => {
  console.log(`Server in ${process.env.STATUS} mode, listening on port: (${PORT}).`);
});

import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../../configs/dbConfig.js";
import doRelease from "../../utils/databaseRelease.js";

const airportWeatherSeverityByRegion = express.Router();

airportWeatherSeverityByRegion.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

airportWeatherSeverityByRegion.route("/").get((req, res) => {
  console.log("Getting comparison");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to DB");
      return;
    }

    // params: /:searchType/:searchValue
    // query: ?searchType=%searchValue=
    // query: ?firstCountry=firstCountryValue&secondCountry=secondCountryValue&industry=industryValue

    console.log("After connection");
    const region = req.query.region;

    const searchQuery = `SELECT EXTRACT(YEAR FROM starttimeutc) AS year, EXTRACT(MONTH FROM starttimeutc) AS month, z.region, SUM(s.RANKING) AS weather_severity, SUM(weather_ct) AS n_of_delays, SUM(weather_delay) AS time_delays
    FROM USWEATHEREVENTS e
    JOIN USWEATHEREVENTSSCALE s ON e.severity = s.severity
    RIGHT JOIN FLIGHTDELAYS f ON f.airport = e.airport AND EXTRACT(YEAR FROM starttimeutc) = f.year AND EXTRACT(MONTH FROM starttimeutc) = f.month
    JOIN ZIPCODEINDEX z ON SUBSTR(e.zipcode, 1, 1) = z.firstdigit
    WHERE z.region = :region
    GROUP BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc), z.region
    ORDER BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc)`;

    connection.execute(
      searchQuery,
      {
        region,
      },
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Error getting data from the DB");
          doRelease(connection);
          return;
        }

        const regions = [];

        result.rows.map((region) => {
          regions.push({
            year: region.YEAR,
            month: region.MONTH,
            region: region.REGION,
            weatherSeverity: region.WEATHER_SEVERITY,
            delays: region.N_OF_DELAYS,
            timeDelays: region.TIME_DELAYS,
          });
        });
        res.json(regions);
        doRelease(connection);
        console.log("released connection");
      }
    );
  });
});

export default airportWeatherSeverityByRegion;

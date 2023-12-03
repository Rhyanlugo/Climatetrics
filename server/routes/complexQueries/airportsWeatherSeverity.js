import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../../configs/dbConfig.js";
import doRelease from "../../utils/databaseRelease.js";

const airportWeatherSeverity = express.Router();

airportWeatherSeverity.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

airportWeatherSeverity.route("/").get((req, res) => {
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
    const airport = req.query.airport;

    const searchQuery = `SELECT EXTRACT(YEAR FROM starttimeutc) AS year, EXTRACT(MONTH FROM starttimeutc) AS month, e.AIRPORT, SUM(s.RANKING) AS weather_severity, SUM(weather_ct) AS n_of_delays, SUM(weather_delay) AS time_delays
    FROM ESTELLEDENIS.USWEATHEREVENTS e
    JOIN ESTELLEDENIS.USWEATHEREVENTSSCALE s ON e.severity = s.severity
    RIGHT JOIN ESTELLEDENIS.FLIGHTDELAYS f ON f.airport = e.airport AND EXTRACT(YEAR FROM starttimeutc) = f.year AND EXTRACT(MONTH FROM starttimeutc) = f.month
    WHERE e.airport = :airport
    GROUP BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc), e.AIRPORT
    ORDER BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc)`;

    connection.execute(
      searchQuery,
      {
        airport,
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

        const airport = [];

        result.rows.map((airportData) => {
          airport.push({
            year: airportData.YEAR,
            month: airportData.MONTH,
            airport: airportData.airport,
            weatherSeverity: airportData.WEATHER_SEVERITY,
            delays: airportData.N_OF_DELAYS,
            timeDelays: airportData.TIME_DELAYS,
          });
        });
        res.json(airport);
        doRelease(connection);
      }
    );
  });
});

export default airportWeatherSeverity;

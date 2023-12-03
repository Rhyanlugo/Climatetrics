import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../configs/dbConfig.js";
import doRelease from "../utils/databaseRelease.js";

const industryOverTimeRouter = express.Router();

industryOverTimeRouter.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

industryOverTimeRouter.route("/compare").get((req, res) => {
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
    const firstCountryValue = req.query.firstCountry;
    const secondCountryValue = req.query.secondCountry;
    const industryValue = req.query.industry;

    const searchQuery = `SELECT t1.industry, t1.year, country1, percentage1, country2, percentage2
    FROM (
        SELECT c2.year, c2.country AS country1, c2.industry, emission / (SELECT SUM(emission)
        FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED c
        WHERE c.year = c2.year AND c.country = c2.country) AS percentage1
        FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED c2
        WHERE c2.country = :firstCountryValue AND c2.industry = :industryValue) t1
        FULL JOIN (
        SELECT c4.year, c4.country AS country2, c4.industry, emission / (SELECT SUM(emission)
        FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED c3
        WHERE c3.year = c4.year AND c3.country = c4.country) AS percentage2
        FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED c4
        WHERE c4.country = :secondCountryValue AND c4.industry = :industryValue) t2
    ON t1.year = t2.year AND t1.industry = t2.industry
    ORDER BY year`;

    connection.execute(
      searchQuery,
      { firstCountryValue, secondCountryValue, industryValue },
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

        const industryComparison = [];

        result.rows.map((comparison) => {
          industryComparison.push({
            industry: comparison.INDUSTRY,
            year: comparison.YEAR,
            firstCountry: comparison.COUNTRY1,
            firstCountryPercentage: comparison.PERCENTAGE1,
            secondCountry: comparison.COUNTRY2,
            secondCountryPercentage: comparison.PERCENTAGE2,
          });
        });
        res.json(industryComparison);
        doRelease(connection);
      }
    );
  });
});

export default industryOverTimeRouter;

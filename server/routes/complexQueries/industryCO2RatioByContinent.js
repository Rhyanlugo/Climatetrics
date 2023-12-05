import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../../configs/dbConfig.js";
import doRelease from "../../utils/databaseRelease.js";

const industryRatioByContinentRouter = express.Router();

industryRatioByContinentRouter.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

industryRatioByContinentRouter.route("/").get((req, res) => {
  console.log("Getting comparison");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to DB");
      return;
    }

    // params: /:searchType/:searchValue
    // query: ?searchType=%searchValue=
    // query: ?continent=continentValue&industry=industryValue

    console.log("After connection");
    const continent = req.query.continent;
    const industry = req.query.industry;

    const searchQuery = `SELECT c2.year, w.continent, SUM(c2.emission) / SUM(total_emission.total) AS ratio
    FROM CO2INDUSTRIESNORMALIZED c2
    JOIN WORLDPOPULATION w ON c2.country_id = w.country_id
    JOIN (
        SELECT
            c.year,
            c.country,
            SUM(c.emission) AS total
        FROM
            CO2INDUSTRIESNORMALIZED c
        GROUP BY
            c.year, c.country
    ) total_emission ON c2.year = total_emission.year AND c2.country = total_emission.country
    WHERE w.continent = :continent AND c2.industry = :industry
    GROUP BY c2.year, w.continent
    ORDER BY c2.year`;

    connection.execute(
      searchQuery,
      { continent, industry },
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

        const continentByIndustry = [];

        result.rows.map((yearlyChange) => {
          continentByIndustry.push({
            year: yearlyChange.YEAR,
            continent: yearlyChange.CONTINENT,
            ratioChange: yearlyChange.RATIO,
          });
        });
        res.json(continentByIndustry);
        doRelease(connection);
      }
    );
  });
});

export default industryRatioByContinentRouter;

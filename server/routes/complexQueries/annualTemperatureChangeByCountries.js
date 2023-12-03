import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../../configs/dbConfig.js";
import doRelease from "../../utils/databaseRelease.js";

const annualTemperatureChangeByCountriesRouter = express.Router();

annualTemperatureChangeByCountriesRouter.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

annualTemperatureChangeByCountriesRouter.route("/").get((req, res) => {
  console.log("Getting comparison");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to DB");
      return;
    }

    // query: ?firstCountry=firstCountryValue&secondCountry=secondCountryValue

    console.log("After connection");
    const firstCountry = req.query.firstCountry;
    const secondCountry = req.query.secondCountry;

    const searchQuery = `SELECT t1.year, t1.country, t1.tempchange, t1.gdp, t1.co2, t2.country, t2.tempchange, t2.gdp, t2.co2
    FROM
    (SELECT a.country, a.year, a.tempchange, c.value AS gdp, e.value AS co2
    FROM ESTELLEDENIS.ANNUALSURFACETEMPCHANGENORMALIZED a
    JOIN ESTELLEDENIS.COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
    JOIN ESTELLEDENIS.CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
    WHERE c.countryname = :firstCountry) t1
    FULL JOIN (
    SELECT a.country, a.year, a.tempchange, c.value AS gdp, e.value AS co2
    FROM ESTELLEDENIS.ANNUALSURFACETEMPCHANGENORMALIZED a
    JOIN ESTELLEDENIS.COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
    JOIN ESTELLEDENIS.CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
    WHERE c.countryname = :secondCountry) t2
    ON t1.year = t2.year
    ORDER BY year`;

    connection.execute(
      searchQuery,
      { firstCountry, secondCountry },
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

        const annualTemperatureChangeByCountries = [];

        result.rows.map((comparison) => {
          annualTemperatureChangeByCountries.push({
            year: comparison.YEAR,
            firstCountry: comparison.COUNTRY,
            firstCountryTempChange: comparison.TEMPCHANGE,
            firstCountryGDP: comparison.GDP,
            firstCountryCO2: comparison.CO2,
            secondCountry: comparison.COUNTRY_1,
            secondCountryTempChange: comparison.TEMPCHANGE_1,
            secondCountryGDP: comparison.GDP_1,
            secondCountryCO2: comparison.CO2_1,
          });
        });
        res.json(annualTemperatureChangeByCountries);
        doRelease(connection);
      }
    );
  });
});

export default annualTemperatureChangeByCountriesRouter;

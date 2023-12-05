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

    const searchQuery = `SELECT 
    t1.year, 
    MAX(t1.country) AS country1,
    MAX(t1.tempchange) AS tempchange1, 
    MAX(t1.gdp) AS gdp1, 
    MAX(t1.co2) AS co2_1, 
    MAX(t2.country) AS country2,
    MAX(t2.tempchange) AS tempchange2, 
    MAX(t2.gdp) AS gdp2, 
    MAX(t2.co2) AS co2_2
FROM
    (
        SELECT 
            a.country, 
            a.year, 
            a.tempchange, 
            c.value AS gdp, 
            e.value AS co2
        FROM 
            ANNUALSURFACETEMPCHANGENORMALIZED a
        JOIN 
            COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
        JOIN 
            CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
        WHERE 
            c.countryname = :firstCountry
    ) t1
FULL JOIN 
    (
        SELECT 
            a.country, 
            a.year, 
            a.tempchange, 
            c.value AS gdp, 
            e.value AS co2
        FROM 
            ANNUALSURFACETEMPCHANGENORMALIZED a
        JOIN 
            COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
        JOIN 
            CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
        WHERE 
            c.countryname = :secondCountry
    ) t2
ON 
    t1.year = t2.year
WHERE 
    t1.year IS NOT NULL AND t2.year IS NOT NULL
GROUP BY 
    t1.year
ORDER BY 
    t1.year`;

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
            firstCountry: comparison.COUNTRY1,
            firstCountryTempChange: comparison.TEMPCHANGE1,
            firstCountryGDP: comparison.GDP1,
            firstCountryCO2: comparison.CO2_1,
            secondCountry: comparison.COUNTRY2,
            secondCountryTempChange: comparison.TEMPCHANGE2,
            secondCountryGDP: comparison.GDP2,
            secondCountryCO2: comparison.CO2_2,
          });
        });
        res.json(annualTemperatureChangeByCountries);
        doRelease(connection);
      }
    );
  });
});

export default annualTemperatureChangeByCountriesRouter;

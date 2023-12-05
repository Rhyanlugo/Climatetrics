import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../../configs/dbConfig.js";
import doRelease from "../../utils/databaseRelease.js";

const databaseCount = express.Router();

databaseCount.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

databaseCount.route("/").get((req, res) => {
  console.log("Getting database count");

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

    const searchQuery = `SELECT
    'ANNUALSURFACETEMPCHANGE' AS "TABLES",
    COUNT(*) AS row_count
  FROM
    ANNUALSURFACETEMPCHANGE
  UNION ALL
  SELECT
    'ANNUALSURFACETEMPCHANGENORMALIZED' AS ANNUALSURFACETEMPCHANGENORMALIZED,
    COUNT(*) AS row_count
  FROM
    ANNUALSURFACETEMPCHANGENORMALIZED
  UNION ALL
  SELECT
    'CHANGEINMEANSEALEVELS' AS CHANGEINMEANSEALEVELS,
    COUNT(*) AS row_count
  FROM
    CHANGEINMEANSEALEVELS
  UNION ALL
  SELECT
    'CITIES' AS CITIES,
    COUNT(*) AS row_count
  FROM
    CITIES
    UNION ALL
  SELECT
    'CITIESOFTHEWORLD' AS CITIESOFTHEWORLD,
    COUNT(*) AS row_count
  FROM
    CITIESOFTHEWORLD
    UNION ALL
  SELECT
    'CO2EMISSIONS' AS CO2EMISSIONS,
    COUNT(*) AS row_count
  FROM
    CO2EMISSIONS
    UNION ALL
  SELECT
    'CO2INDUSTRIES' AS CO2INDUSTRIES,
    COUNT(*) AS row_count
  FROM
    CO2INDUSTRIES
    UNION ALL
  SELECT
    'CO2INDUSTRIESNORMALIZED' AS CO2INDUSTRIESNORMALIZED,
    COUNT(*) AS row_count
  FROM
    CO2INDUSTRIESNORMALIZED
    UNION ALL
  SELECT
    'COUNTRIES' AS COUNTRIES,
    COUNT(*) AS row_count
  FROM
    COUNTRIES
    UNION ALL
  SELECT
    'COUNTRYGDP' AS COUNTRYGDP,
    COUNT(*) AS row_count
  FROM
    COUNTRYGDP
    UNION ALL
  SELECT
    'FLIGHTDELAYS' AS FLIGHTDELAYS,
    COUNT(*) AS row_count
  FROM
    FLIGHTDELAYS
    UNION ALL
  SELECT
    'GLOBALCO2' AS GLOBALCO2,
    COUNT(*) AS row_count
  FROM
    GLOBALCO2
    UNION ALL
  SELECT
    'GLOBALLANDTEMPERATURESBYCOUNTRY' AS GLOBALLANDTEMPERATURESBYCOUNTRY,
    COUNT(*) AS row_count
  FROM
    GLOBALLANDTEMPERATURESBYCOUNTRY
    UNION ALL
  SELECT
    'USWEATHEREVENTS' AS USWEATHEREVENTS,
    COUNT(*) AS row_count
  FROM
    USWEATHEREVENTS
    UNION ALL
  SELECT
    'USWEATHEREVENTSSCALE' AS USWEATHEREVENTSSCALE,
    COUNT(*) AS row_count
  FROM
    USWEATHEREVENTSSCALE
    UNION ALL
  SELECT
    'WORLDPOPULATION' AS WORLDPOPULATION,
    COUNT(*) AS row_count
  FROM
    WORLDPOPULATION
    UNION ALL
  SELECT
    'ZIPCODEINDEX' AS ZIPCODEINDEX,
    COUNT(*) AS row_count
  FROM
    ZIPCODEINDEX
    UNION ALL
  SELECT
    'Total' AS table_name,
    SUM(row_count) AS row_count
  FROM (
  SELECT COUNT(*) AS row_count FROM ANNUALSURFACETEMPCHANGE
  UNION ALL
  SELECT COUNT(*) AS row_count FROM ANNUALSURFACETEMPCHANGENORMALIZED
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CHANGEINMEANSEALEVELS
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CITIES
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CITIESOFTHEWORLD
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CO2EMISSIONS
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CO2INDUSTRIES
  UNION ALL
  SELECT COUNT(*) AS row_count FROM CO2INDUSTRIESNORMALIZED
  UNION ALL
  SELECT COUNT(*) AS row_count FROM COUNTRIES
  UNION ALL
  SELECT COUNT(*) AS row_count FROM COUNTRYGDP
  UNION ALL
  SELECT COUNT(*) AS row_count FROM FLIGHTDELAYS
  UNION ALL
  SELECT COUNT(*) AS row_count FROM GLOBALCO2
  UNION ALL
  SELECT COUNT(*) AS row_count FROM GLOBALLANDTEMPERATURESBYCOUNTRY
  UNION ALL
  SELECT COUNT(*) AS row_count FROM USWEATHEREVENTS
  UNION ALL
  SELECT COUNT(*) AS row_count FROM USWEATHEREVENTSSCALE
  UNION ALL
  SELECT COUNT(*) AS row_count FROM WORLDPOPULATION
  UNION ALL
  SELECT COUNT(*) AS row_count FROM ZIPCODEINDEX
  )`;

    connection.execute(
      searchQuery,
      {},
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

        const databaseCount = [];

        result.rows.map((table) => {
          databaseCount.push({
            tableName: table.TABLES,
            rowCount: table.ROW_COUNT,
          });
        });
        res.json(databaseCount);
        doRelease(connection);
      }
    );
  });
});

export default databaseCount;

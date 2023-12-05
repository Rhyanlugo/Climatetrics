import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "../configs/dbConfig.js";
import doRelease from "../utils/databaseRelease.js";

const menuDisplayRouter = express.Router();

menuDisplayRouter.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

menuDisplayRouter.route("/countryByCO2").get((req, res) => {
  console.log("GETTING Countries");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery =
      "SELECT DISTINCT country FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED ORDER BY country";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const countries = [];

        result.rows.map((country) => {
          countries.push({
            countryName: country.COUNTRY,
          });
        });
        res.json(countries);
        doRelease(connection);
      }
    );
  });
});

menuDisplayRouter.route("/continentByCO2").get((req, res) => {
  console.log("GETTING Countries");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery = "SELECT DISTINCT continent FROM ESTELLEDENIS.WORLDPOPULATION";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const continents = [];

        result.rows.map((continent) => {
          continents.push({
            continentName: continent.CONTINENT,
          });
        });
        res.json(continents);
        doRelease(connection);
      }
    );
  });
});

menuDisplayRouter.route("/industryByCO2").get((req, res) => {
  console.log("GETTING Industry");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery =
      "SELECT DISTINCT industry FROM ESTELLEDENIS.CO2INDUSTRIESNORMALIZED ORDER BY industry";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const industries = [];

        result.rows.map((industry) => {
          industries.push({
            industryName: industry.INDUSTRY,
          });
        });
        res.json(industries);
        doRelease(connection);
      }
    );
  });
});

menuDisplayRouter.route("/countryByAnnualTemperature").get((req, res) => {
  console.log("GETTING Countries");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery =
      "SELECT DISTINCT country FROM ESTELLEDENIS.ANNUALSURFACETEMPCHANGENORMALIZED ORDER BY country";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const countries = [];

        result.rows.map((country) => {
          countries.push({
            countryName: country.COUNTRY,
          });
        });
        res.json(countries);
        doRelease(connection);
      }
    );
  });
});

menuDisplayRouter.route("/airportsByWeatherEvents").get((req, res) => {
  console.log("GETTING airports");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery = "SELECT DISTINCT airport FROM FLIGHTDELAYS  ORDER BY airport";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const airports = [];

        result.rows.map((airport) => {
          airports.push({
            airport: airport.AIRPORT,
          });
        });
        res.json(airports);
        doRelease(connection);
      }
    );
  });
});

menuDisplayRouter.route("/regionsAirportsByWeatherEvents").get((req, res) => {
  console.log("GETTING regions");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    const searchQuery = "SELECT DISTINCT region FROM ESTELLEDENIS.ZIPCODEINDEX ORDER BY region";

    connection.execute(
      searchQuery,
      {},
      {
        outFormat: oracledb.OBJECT,
      },
      (err, result) => {
        if (err) {
          console.error(err.message);

          res.status(500).send("Error getting data from the database");
          doRelease(connection);
          return;
        }

        const regions = [];

        result.rows.map((region) => {
          regions.push({
            region: region.REGION,
          });
        });
        res.json(regions);
        doRelease(connection);
      }
    );
  });
});

export default menuDisplayRouter;

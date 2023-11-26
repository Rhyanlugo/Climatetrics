/* Here's the dummy database data if you wish to try it for yourself.
  CREATE TABLE EMPLOYEE (
    ID INTEGER NOT NULL,
    FIRSTNAME VARCHAR(255),
    LASTNAME VARCHAR(255),
    EMAIL VARCHAR(255),
    PHONE VARCHAR(255),
    BIRTHDATE VARCHAR(10),
    TITLE VARCHAR(255),
    DEPARTMENT VARCHAR(255),
    PRIMARY KEY (ID)
  ); 

  CREATE SEQUENCE EMPLOYEE_SEQ
  START WITH     100
  INCREMENT BY   1; 

  INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT) VALUES (EMPLOYEE_SEQ.nextVal, 'Hugh', 'Jast', 'Hugh.Jast@example.com', '730-715-4446', '1970-11-28' , 'National Data Strategist', 'Mobility'); 
  INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT) VALUES (EMPLOYEE_SEQ.nextVal, 'Toy', 'Herzog', 'Toy.Herzog@example.com', '769-569-1789','1961-08-08', 'Dynamic Operations Manager', 'Paradigm'); 
  INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT) VALUES (EMPLOYEE_SEQ.nextVal, 'Reed', 'Hahn', 'Reed.Hahn@example.com', '429-071-2018', '1977-02-05', 'Future Directives Facilitator', 'Quality'); 
  INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT) VALUES (EMPLOYEE_SEQ.nextVal, 'Novella', 'Bahringer', 'Novella.Bahringer@example.com', '293-596-3547', '1961-07-25' , 'Principal Factors Architect', 'Division'); 
  INSERT INTO EMPLOYEE (ID, FIRSTNAME, LASTNAME, EMAIL, PHONE, BIRTHDATE, TITLE, DEPARTMENT) VALUES (EMPLOYEE_SEQ.nextVal, 'Zora', 'Sawayn', 'Zora.Sawayn@example.com', '923-814-0502', '1978-03-18' , 'Dynamic Marketing Designer', 'Security'); 
*/
import bodyParser from "body-parser";

import express from "express";
import oracledb from "oracledb";
import { dbConfig } from "./configs/dbConfig.js";

let PORT;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

router.use((req, res, next) => {
  console.log("REQUEST:" + req.method + "   " + req.url);
  console.log("BODY:" + JSON.stringify(req.body));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // Should only need GET but just in case we can use POST, OPTIONS, PUT, PATCH, DELETE if needed for some reason.
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

/**
 * GET /
 * Returns a list of employees
 */
router.route("/employees").get((req, res) => {
  console.log("GETTING EMPLOYEES");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to the database");
      return;
    }

    console.log("After connection");

    connection.execute(
      "SELECT * FROM employee",
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

        console.log(`RESULT: ${JSON.stringify(result, null, 2)}`);

        const employees = [];

        result.rows.map((employee) => {
          employees.push({
            id: employee.ID,
            firstName: employee.FIRSTNAME,
            lastName: employee.LASTNAME,
            email: employee.EMAIL,
            phone: employee.PHONE,
            birthDate: employee.BIRTHDATE,
            title: employee.TITLE,
            dept: employee.DEPARTMENT,
          });
        });
        res.json(employees);
        doRelease(connection);
      }
    );
  });
});

/**
 * GET /searchType/searchValue
 * Returns a list of employees that match the criteria
 */

router.route("/employees/search").get((req, res) => {
  console.log("GET EMPLOYEES BY CRITERIA");

  oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error connecting to DB");
      return;
    }

    // params: /:searchType/:searchValue
    // query: ?searchType=%searchValue=

    console.log("After connection");
    const searchType = req.query.searchType;
    const searchValue = req.query.searchValue;

    console.log(`SEARCH TYPE: ${searchType}`);
    console.log(`SEARCH VALUE: ${searchValue}`);

    const searchQuery = `SELECT * FROM employee WHERE ${searchType} = :searchValue`;

    connection.execute(
      searchQuery,
      { searchValue },
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

        console.log(`RESULT: ${JSON.stringify(result, null, 2)}`);

        const employees = [];

        result.rows.map((employee) => {
          employees.push({
            id: employee.ID,
            firstName: employee.FIRSTNAME,
            lastName: employee.LASTNAME,
            email: employee.EMAIL,
            phone: employee.PHONE,
            birthDate: employee.BIRTHDATE,
            title: employee.TITLE,
            dept: employee.DEPARTMENT,
          });
        });
        res.json(employees);
        doRelease(connection);
      }
    );
  });
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server in ${process.env.STATUS} mode, listening on port: (${PORT}).`);
});

// Database functions
// TODO: MOVE TO SEPARATE FILES
const doRelease = (connection) => {
  connection.release((err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

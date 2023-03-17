// dotenv
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// MYSQL connection
console.log(process.env.DATABASE);
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOSTNAME,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
// Connection End

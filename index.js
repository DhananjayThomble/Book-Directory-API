// dotenv
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/", require("./routes/bookRouter"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

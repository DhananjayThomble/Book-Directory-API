// dotenv
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express"); // for documentation
const yamljs = require("yamljs");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// documentation
const swaggerDocument = yamljs.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", require("./routes/bookRouter"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

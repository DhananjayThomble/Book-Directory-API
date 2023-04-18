// dotenv
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express"); // for documentation
const yamljs = require("yamljs");
const sequelize = require("./config/database");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// Sequelize connection
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database: ", error);
    }
};
connectToDatabase().then(() => {
    // Sync: It is used to create the table in the database. It will create the table only if it does not exist.
    // if any changes are made to the model, it will update the table.
    sequelize.sync().then(() => {
        console.log("Database & tables created!");
    });
});

// documentation
const swaggerDocument = yamljs.load("./swagger.yaml");
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", require("./routes/bookRouter"));

app.get("/", (req, res) => {
    // redirect to documentation
    res.redirect("/doc");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


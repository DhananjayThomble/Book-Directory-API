// sequelize configuration
const {Sequelize} = require("sequelize");

// MYSQL connection configuration
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOSTNAME,
        dialect: "mysql",
    }
);

module.exports = sequelize;
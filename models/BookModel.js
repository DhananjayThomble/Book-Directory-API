const {Sequelize, DataTypes} = require("sequelize");

// MYSQL connection
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOSTNAME,
        dialect: "mysql",
    }
);
// .authenticate() is used to check if the connection is established or not
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });
// Connection End

// Model: It is used to define the structure of the table.
const BookModel = sequelize.define("Book", {
    id: {
        type: DataTypes.UUID,   // used to generate unique id
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// Model End

// Sync: It is used to create the table in the database.
sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

// Sync End
module.exports = BookModel;

const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

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

module.exports = BookModel;

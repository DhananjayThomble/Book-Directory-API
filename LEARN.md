# Learn How to Build Book Directory API using Sequelize ORM

## Introduction:
In this Project, we will build a RESTful Book Directory API with Swagger documentation using Node.js, Express, and Sequelize.
- Building a RESTful API that includes Swagger documentation is an essential component of many modern web applications. Swagger documentation provides a user-friendly way to explore and interact with your API, enabling developers to better understand your API’s capabilities and how to use it.

- We will create a Book model, router, and index file. The Book model will be used to define the structure of the table. The router will be used to define the RESTful endpoints, and the index file will be used to define the server.

## Prerequisites:

- Basic knowledge of Node.js, Express, and Sequelize.
- A text editor or IDE installed on your computer.
- A MySQL database installed on your computer(you can also use XAMPP on Windows).

## Steps:
### 1. Set up the project:
First, let’s create a new directory for our project and navigate into it using the command line.
``` 
mkdir book-directory-api
cd book-directory-api
```

Next, we will create a new package.json file using the following command:
```
npm init -y
```
This will create a new package.json file in your project directory with default values. 
The -y flag is optional, basically it skips the prompt for asking about package details.

### 2: Install the required dependencies:

We will now install the required dependencies for our project. 
We will be using express, body-parser, sequelize, mysql2, dotenv, swagger-ui-express, and yamljs.

```
npm install express body-parser sequelize mysql2 dotenv swagger-ui-express yamljs
```

- **express:** A Node.js web application framework for building web applications.
- **body-parser:** A middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property.
- **sequelize:** A promise-based ORM for Node.js, that supports PostgreSQL, MySQL, SQLite and MSSQL.
- **mysql2:** A MySQL client for Node.js with focus on performance.
- **dotenv:** A zero-dependency module that loads environment variables from a .env file into process.env.
- **swagger-ui-express:** A middleware that serves auto-generated Swagger UI documentation from your API endpoints.
- **yamljs:** A library for loading YAML files.

### 3: Create a MySQL database:
Next, we will create a MySQL database named 'bookDB' that we will use for our application. 
You can use any database name of your choice.
    
```shell
mysql -u root -p
```
You can also use phpMyAdmin or any other MySQL GUI tool to create a database.

````sql
CREATE DATABASE bookDB;
````

### 4. Create the config file and add the database credentials:
```shell
touch config/database.js  # create a new file named database.js in config directory
```
Open the database.js file in your text editor/IDE and add the following code:
```javascript
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
````

### 5: Create the Book model:
We will create a new file named BookModel.js in a new directory named models. 
This file will be used to define the structure of the table.
````shell
mkdir models
touch models/BookModel.js
````

Open the BookModel.js file in your text editor/IDE and add the following code:
```javascript
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

```

### 6: Create the Book router:
```shell
touch routes/BookRouter.js
```

Open the BookRouter.js and add the following code:
```javascript
const express = require("express");
const bookRouter = express.Router();
const BookModel = require("../models/BookModel");
const isEmpty = require("../util/isEmpty");

// get all books sorted by title
bookRouter.get("/", async (req, res) => {
  const books = await BookModel.findAll({
    order: [["title", "ASC"]],
  });
  res.status(200).json(books);
});

// Insert a book into database
bookRouter.post("/", isEmpty, async (req, res) => {
  const { title, author, release_date } = req.body;

  // check if release_date is valid or not
  if (isNaN(Date.parse(release_date))) {
    return res.status(400).json({ message: "Invalid release_date" });
  }

  // check if book already exists
  const bookExists = await BookModel.findOne({ where: { title } });
  if (bookExists)
    return res.status(409).json({ message: "Book already available" });
  // create/insert new book
  const book = await BookModel.create({
    title,
    author,
    release_date,
  });
  res.status(201).json(book);
});

// get a book by title
bookRouter.get("/:title", async (req, res) => {
  const { title } = req.params;
  const book = await BookModel.findOne({ where: { title } });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.status(200).json(book);
});

// update a book by title
bookRouter.put("/:title", isEmpty, async (req, res) => {
  const { title } = req.params;
  const { newTitle, author, release_date } = req.body;

  // check if release_date is valid or not
  if (isNaN(Date.parse(release_date))) {
    return res.status(400).json({ message: "Invalid release_date" });
  }
  /*
    Date.parse() returns the number of milliseconds since 1 January 1970 00:00:00 UTC.
    If the date is invalid, it returns NaN. NaN stands for Not a Number.
  */

  //   console.log(newTitle);
  const book = await BookModel.update(
    { title: newTitle, author, release_date },
    { where: { title } }
  );
  // console.log(book);
  if (book[0] === 0) return res.status(404).json({ message: "Book not found" });
  res.status(200).json(book); // returns 1 if updated // returns 0 if not updated
});

// delete a book by title
bookRouter.delete("/:title", async (req, res) => {
  const { title } = req.params;
  // check if book exists or not
  const bookExists = await BookModel.findOne({ where: { title } });
  if (!bookExists) return res.status(404).json({ message: "Book not found" });
  // delete book
  const book = await BookModel.destroy({ where: { title } });
  if (book === 1)
    res.status(200).json({ message: "Book deleted successfully" });
});

module.exports = bookRouter;
```

### 7: Create the index.js file:
```shell
touch index.js
```

Open the index.js file and add the following code:
```javascript
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

```

### 8: Create the swagger.yaml file:
```shell
touch swagger.yaml
```

Open the swagger.yaml file and add the following code:
```yaml
openapi: 3.0.0
info:
  title: Book Directory API
  description: API for managing books in MYSQL database using Sequelize ORM
  version: 1.0.0

servers:
  - url: https://book.dhananjaythomble.me
    description: Production server
    
  - url: http://localhost:3000
    description: Local server

paths:
  /api/:
    get:
      summary: Get all books in alphabetical order by title
      description: Get all books
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    title:
                      type: string
                    author:
                      type: string
                    release_date:
                      type: string
                    createdAt:
                      type: string
                    updatedAt:
                      type: string

    post:
      summary: Create a book
      description: Create a book in the database
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                author:
                  type: string
                release_date:
                  type: string
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  title:
                    type: string
                  author:
                    type: string
                  release_date:
                    type: string
                  createdAt:
                    type: string
                  updatedAt:
                    type: string
        "409":
          description: Book already exists
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Book already exists

  /api/{title}:
    get:
      summary: Get book by title
      description: Get book by title
      parameters:
        - in: path
          name: title
          schema:
            type: string
          required: true
          description: Title of the book
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  title:
                    type: string
                  author:
                    type: string
                  release_date:
                    type: string
                  createdAt:
                    type: string
                  updatedAt:
                    type: string

        "404":
          description: Book not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Book not found

    put:
      summary: Update book by title
      description: Update book by title
      parameters:
        - in: path
          name: title
          schema:
            type: string
          required: true
          description: Title of the book
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                author:
                  type: string
                release_date:
                  type: string

      responses:
        "200":
          description: Book updated successfully
          content:
            application/json:
              schema:
                type: number
                example: 1
        "404":
          description: Book not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Book not found
    delete:
      summary: Delete book by title
      description: Delete book by title
      parameters:
        - in: path
          name: title
          schema:
            type: string
          required: true
          description: Title of the book
      responses:
        "200":
          description: Book deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Book deleted successfully
        "404":
          description: Book not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Book not found
```

### 9: Create the .env file:

```shell
touch .env
```

Open the .env file and add the following code:
```shell
PORT=3000
DATABASE=PutYourDatabaseNameHere
DATABASE_USER=PutYourDatabaseUserNameHere
DATABASE_PASSWORD=PutYourDatabasePasswordHere
DATABASE_HOSTNAME=PutYourDatabaseHostNameHere
```

Change the values of the environment variables according to your database credentials.

### 10: Run the application:

```shell
npm start
```
Now goto http://localhost:3000/doc to see the documentation and test our APIs.


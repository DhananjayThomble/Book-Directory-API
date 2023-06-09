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

const express = require("express");
const bookRouter = express.Router();
const BookModel = require("../models/BookModel");

bookRouter.get("/", async (req, res) => {
  const books = await BookModel.findAll();
  res.status(200).json(books);
});

bookRouter.post("/", async (req, res) => {
  const { title, author, release_date } = req.body;
  // check if book already exists
  const bookExists = await BookModel.findOne({ where: { title } });
  if (bookExists)
    return res.status(409).json({ message: "Book already available" });
  // create book
  const book = await BookModel.create({
    title,
    author,
    release_date,
  });
  res.status(201).json(book);
});

bookRouter.get("/:title", async (req, res) => {
  const { title } = req.params;
  const book = await BookModel.findOne({ where: { title } });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.status(200).json(book);
});

bookRouter.put("/:title", async (req, res) => {
  const { title } = req.params;
  const { newTitle, author, release_date } = req.body;
  //   console.log(newTitle);
  const book = await BookModel.update(
    { title: newTitle, author, release_date },
    { where: { title } }
  );
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.status(200).json(book); // returns 1 if updated // returns 0 if not updated
});

bookRouter.delete("/:title", async (req, res) => {
  const { title } = req.params;
  // check if book exists or not
  const bookExists = await BookModel.findOne({ where: { title } });
  if (!bookExists) return res.status(404).json({ message: "Book not found" });
  // delete book
  const book = await BookModel.destroy({ where: { title } });
  res.status(200).json(book);
});

module.exports = bookRouter;

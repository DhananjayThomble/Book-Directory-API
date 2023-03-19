// middleware to check whether the request body is empty or not

const isEmpty = (req, res, next) => {
  // check if request body params are empty or not
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }
  // check all the request body params are empty or not
  for (let key in req.body) {
    if (req.body[key] === "") {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
  }
  next();
};

module.exports = isEmpty;

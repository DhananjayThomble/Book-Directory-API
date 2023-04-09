// middleware to check whether the request body is empty or not

// check if request body params are empty or not
const isEmpty = (req, res, next) => {
    /*
        Object.keys() returns an array of a given object's own enumerable property names.
        Syntax: Object.keys(obj)
        Parameters: obj: The object whose enumerable and non-enumerable properties are to be returned.
        Return value: An array of strings that represent all the enumerable properties of the given object.
        Example:
        const object1 = {
            name: 'john doe',
            age: 42,
            gender: 'male'
        };
        console.log(Object.keys(object1));
        // expected output: Array ["name", "age", "gender"]
    * */
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }
  // check all the request body params are empty or not
  for (let key in req.body) {
    if (req.body[key] === "") {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
  }
  next();   // if all the request body params are not empty then call next middleware.
            // here 'next middleware' means the next function in the route
};

module.exports = isEmpty;

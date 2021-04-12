var express = require("express");
var router = express.Router();
var fs = require("fs");
var cors = require("cors");

router.use(cors());
//creates random ID
var { v4: uuidv4 } = require("uuid");

//Download from database
var bookData = fs.readFileSync("./database/database.json", "utf8");
console.log(bookData);

// --- GET book listing. reseve All books from database ---//
router.get("/", function (req, res, next) {
  //res.send("hej från books router ");

  res.json({ books: JSON.parse(bookData) });
});

// ---  get book by Id --- //
router.get("/:id", (req, res) => {
  let bookId = req.params.id;
  console.log(bookId);

  var bookData = JSON.parse(
    fs.readFileSync("./database/database.json", "utf8")
  );
  //console.log(bookData);
  let bookFound = bookData.filter((book) => book._id === bookId);
  console.log(bookFound);
  res.send(bookFound);
});

// ---  get rent book --- //
router.get("/rent/:id", (req, res) => {
  let bookId = req.params.id;

  var bookData = JSON.parse(
    fs.readFileSync("./database/database.json", "utf8")
  );
  bookData.forEach((book) => {
    if (book._id === bookId) {
      book.available = book.available ? false : true;
    }
  });

  // overwrite json file
  fs.writeFileSync(
    "./database/database.json",
    JSON.stringify(bookData),
    "utf8"
  );

  res.json({ book: bookData });
});

// --- POST add book --- //
router.post("/add", function (req, res, next) {
  //Create variable to hold the new object created from frontend
  //the object is in "req.body"
  let book = req.body;

  //create a unique id for the book object
  let bookId = uuidv4();
  // Assing the new id to the book object
  book._id = bookId;

  //Read the database (file is in json format)
  let data = fs.readFileSync("./database/database.json", "utf8");
  //convert to js object
  let parsedData = JSON.parse(data);
  //push the new object into parsedData which is an array
  parsedData.unshift(book);

  //write the new updated array into the database
  fs.writeFileSync(
    "./database/database.json",
    JSON.stringify(parsedData),
    "utf8"
  );

  res.json({ add: "success" });
});

router.delete("/delete/:id", (req, res) => {
  let bookId = req.params.id;
  console.log(bookId);
  //Read the database (file is in json format)
  let data = JSON.parse(fs.readFileSync("./database/database.json", "utf8"));

  // filtrera ut den vi vill ta bort
  let filtered = data.filter((book) => book._id !== bookId);

  //write the new updated array into the database
  fs.writeFileSync(
    "./database/database.json",
    JSON.stringify(filtered, null, 2),
    "utf8"
  );
  // skicka
  res.json({ deleted: "success" });
});
module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors"); // Add this line

const app = express();
const port = 3000;

app.use(cors()); // Add this line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "book_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Add this route to handle the /books endpoint
app.get("/books", (req, res) => {
  const query = "SELECT * FROM books";

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data from MySQL:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

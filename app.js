const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// these lines after app.use(bodyParser.json());
app.use(express.static(__dirname));

//connecting to db
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

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Perform your authentication check here
  const isLoggedIn = true; /* your authentication check here */

  if (isLoggedIn) {
    next(); // User is authenticated, proceed to the next middleware/route
  } else {
    res.status(401).send("Unauthorized"); // User is not authenticated
  }
};

// Apply the middleware to the routes that require authentication
app.use("/books", isAuthenticated);

// this route to handle the /books endpoint
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

// this route to handle the user login
// Add this route after your user registration route

// this route to handle user login
app.post("/login", (req, res) => {
  console.log("Login request received");

  const { loginUsername, loginPassword } = req.body;
  console.log("Received login data:", { loginUsername, loginPassword });

  // Retrieve user from the users table based on the provided username
  const selectUserQuery = "SELECT * FROM users WHERE username = ? LIMIT 1";
  db.query(selectUserQuery, [loginUsername], (error, results) => {
    if (error) {
      console.error("Error querying user in MySQL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Check if the user exists
      if (results.length === 1) {
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(
          loginPassword,
          user.password
        );

        if (isPasswordValid) {
          // Password is correct, generate and return a JWT token
          const token = jwt.sign({ userId: user.id }, "yourSecretKey", {
            expiresIn: "1h", // You can adjust the expiration time
          });
          res.json({ token });
        } else {
          // Password is incorrect
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        // User not found
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
});

// this route to handle the user registration
app.post("/register", (req, res) => {
  console.log("Registration request received");

  const { registerUsername, registerPassword, registerEmail } = req.body;
  console.log("Received data:", {
    registerUsername,
    registerPassword,
    registerEmail,
  });

  const hashedPassword = bcrypt.hashSync(registerPassword, 10); // Hash the password
  console.log("Hashed password:", hashedPassword);

  // Insert user into the users table
  const insertUserQuery =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  db.query(
    insertUserQuery,
    [registerUsername, hashedPassword, registerEmail],
    (error, results) => {
      if (error) {
        console.error("Error registering user in MySQL:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "User registered successfully" });
      }
    }
  );
});

// this route to handle the POST request for adding a new book
app.post("/books", (req, res) => {
  console.log("Books request received");

  const { title, totalPages, rating, isbn, publishedDate, publisher } =
    req.body;
  const query =
    "INSERT INTO books (book_title, book_total_page, rating, isbn, published_date, publisher_id) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the query
  db.query(
    query,
    [title, totalPages, rating, isbn, publishedDate, publisher],
    (error, results) => {
      if (error) {
        console.error("Error adding new book to MySQL:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Retrieve the updated book list
        const selectQuery = "SELECT * FROM books";
        db.query(selectQuery, (selectError, selectResults) => {
          if (selectError) {
            console.error("Error fetching data from MySQL:", selectError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json(selectResults);
          }
        });
      }
    }
  );
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//listening on http://localhost:3000/
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

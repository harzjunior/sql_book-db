# Book List Management System

## About

The Book List Management System is a simple web application that allows users to manage a list of books. Users can view the existing book list, add new books, and experience a streamlined user interface.

## Requirements

To run this project, ensure you have the following:

- Node.js installed on your machine.
- MySQL installed on your machine with the necessary database (`book_db`) and table (`books`) created.

## Technologies Used

- **Node.js**: Backend server for handling requests and interacting with the MySQL database.
- **Express.js**: Web application framework for Node.js, used for routing and middleware.
- **MySQL**: Database management system for storing book data.
- **HTML/CSS/JavaScript**: Frontend technologies for creating the user interface and handling user interactions.

## Project Efficiency

The project focuses on simplicity and efficiency. Key features include:

- **Book Addition Form**: An intuitive form for adding new books with real-time updates to the book list.
- **Responsive Design**: The user interface adapts to various screen sizes for a seamless experience.

## Future Features

The project aims to expand its functionality with upcoming features such as:

- **Full CRUD Operations**: Implementing full CRUD (Create, Read, Update, Delete) capabilities for book management.
- **User Authentication**: Adding user authentication for secure access to the book management system.

## Code Snippets

### Connecting to MySQL Database (appOne.js)

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "book_db",
});

// Connection status logging
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});
```

### Handling Form Submission and Displaying Success Message (index.html)

```javascript
// Handle form submission
document.getElementById('addBookForm').addEventListener('submit', function (event) {
    // ... (existing code) ...

    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');

    // Refresh the book list
    const tableBody = document.querySelector('#bookTable tbody');
    tableBody.innerHTML = '';
    data.forEach(book => {
        // ... (existing code) ...
    });

    // Hide success message after 2 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 2000);
});
```
---

// Fetch data from the server and populate the table
fetch("/books")
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.querySelector("#bookTable tbody");
    data.forEach((book) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${book.id}</td><td>${book.book_title}</td><td>${book.author_name}</td><td>${book.email}</td>`;
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// Handle form submission
document
  .getElementById("addBookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const email = document.getElementById("email").value;

    // Send a POST request to add the new book
    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, email }),
    })
      // .then(response => response.json())
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Clear the form fields
        document.getElementById("addBookForm").reset();

        // Show success notification message
        const successMessage = document.getElementById("successMessage");
        successMessage.classList.remove("hidden");

        // Refresh the book list
        const tableBody = document.querySelector("#bookTable tbody");
        tableBody.innerHTML = "";
        data.forEach((book) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${book.id}</td><td>${book.book_title}</td><td>${book.author_name}</td><td>${book.email}</td>`;
          tableBody.appendChild(row);
        });

        // Hide success notification message after 2 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 2000);
      })
      .catch((error) => console.error("Error adding new book:", error.message));
  });

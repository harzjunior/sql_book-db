const options = {
  timeZone: "Africa/Lagos", // Set to the time zone of West Africa (Lagos)
  weekday: "long", // Display the full name of the day of the week
  year: "numeric", // Display the year
  month: "long", // Display the full name of the month
  day: "numeric", // Display the day of the month
  hour: "numeric", // Display the hour (24-hour format)
  minute: "numeric", // Display the minute
};

// Fetch data from the server and populate the table
fetch("/books")
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.querySelector("#bookTable tbody");
    data.forEach((book) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${book.book_id}</td><td>${book.book_title}</td><td>${
        book.book_total_page
      }</td>
      <td>${book.rating}</td><td>${book.isbn}</td><td>${Date(
        book.published_date
      )}</td><td>${book.publisher_id}</td>`;
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
    const totalPages = document.getElementById("totalPages").value;
    const rating = document.getElementById("rating").value;
    const isbn = document.getElementById("isbn").value;
    const publishedDate = document.getElementById("publishedDate").value;
    const publisher = document.getElementById("publisher").value;

    // Send a POST request to add the new book
    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        totalPages,
        rating,
        isbn,
        publishedDate,
        publisher,
      }),
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
          row.innerHTML = `<td>${book.book_id}</td><td>${book.book_title}</td><td>${book.book_total_page}</td>
          <td>${book.rating}</td><td>${book.isbn}</td><td>${book.published_date}</td><td>${book.publisher_id}</td>`;
          tableBody.appendChild(row);
        });

        // Hide success notification message after 2 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 2000);
      })
      .catch((error) => console.error("Error adding new book:", error.message));
  });

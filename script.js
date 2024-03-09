// Check if the user is logged in (replace 'isLoggedIn' with your actual authentication check)
const isLoggedIn = localStorage.getItem("token") !== null;

if (isLoggedIn) {
  document.getElementById("authenticatedContent").style.display = "block";
}

function toggleButtonsVisibility(loggedIn) {
  const loginBtn = document.getElementById("loginBtn");
  const createBtn = document.getElementById("createBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loggedIn) {
    loginBtn.style.display = "none";
    createBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    createBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

// Set initial visibility of buttons
toggleButtonsVisibility(isLoggedIn);

function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  modal.style.display = show ? "block" : "none";

  // Toggle nav buttons and search visibility
  const headerModal = document.getElementById("headerButtons");
  headerModal.style.display = show ? "none" : "block";
}

function showLoginModal() {
  toggleModal("loginModal", true);
}

function closeLoginModal() {
  toggleModal("loginModal", false);
}

function showRegisterModal() {
  toggleModal("registerModal", true);
}

function closeRegisterModal() {
  toggleModal("registerModal", false);
}

document.getElementById("loginBtn").addEventListener("click", showLoginModal);
document
  .getElementById("closeLoginModal")
  .addEventListener("click", closeLoginModal);
document
  .getElementById("createBtn")
  .addEventListener("click", showRegisterModal);
document
  .getElementById("closeRegisterModal")
  .addEventListener("click", closeRegisterModal);

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear the token from localStorage
  localStorage.removeItem("token");

  // Set visibility of buttons after logout
  toggleButtonsVisibility(false);

  // Optionally, you can redirect to the login page or perform other actions
  console.log("User logged out successfully!");

  // Reload the page to fetch updated data and show book input fields
  location.reload(true);
});

window.addEventListener("click", (event) => {
  const registerModal = document.getElementById("registerModal");
  if (event.target === registerModal) {
    closeRegisterModal();
  }
});

// Fetch data from the server and populate the table
function fetchDataAndPopulateTable() {
  fetch("/books")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#bookTable tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      data.forEach((book) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${book.book_id}</td><td>${book.book_title}</td><td>${book.book_total_page}</td>
          <td>${book.rating}</td><td>${book.isbn}</td><td>${book.published_date}</td><td>${book.publisher_id}</td>`;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// If the user is authenticated, fetch data and show book input fields
if (isLoggedIn) {
  fetchDataAndPopulateTable();
}

// Handle form submission
document
  .getElementById("addBookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if the user is logged in before allowing book addition
    if (!isLoggedIn) {
      alert("Please log in or create an account to add a book.");
      return;
    }

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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        fetchDataAndPopulateTable();

        // Hide success notification message after 2 seconds
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 2000);
      })
      .catch((error) => console.error("Error adding new book:", error.message));
  });

// Handle user login
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;

    // Send a POST request to authenticate the user
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginUsername,
        loginPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the server sends a token upon successful login
        const token = data.token;
        // Store the token securely (e.g., in localStorage) for future authenticated requests
        localStorage.setItem("token", token);

        // Optional: Redirect to a different page or update UI for authenticated user
        console.log("User logged in successfully!");

        // Clear the input fields
        document.getElementById("loginForm").reset();

        // Reload the page to fetch updated data and show book input fields
        location.reload(true);
      })
      .catch((error) => console.error("Error logging in:", error.message));
  });

// Handle user registration
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const registerUsername = document.getElementById("registerUsername").value;
    const registerPassword = document.getElementById("registerPassword").value;
    const registerEmail = document.getElementById("registerEmail").value;

    // Send a POST request to register the user
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUsername,
        registerPassword,
        registerEmail,
      }),
    })
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
        document.getElementById("registerForm").reset();
        console.log(data); // Log the response for debugging
        alert("User registered successfully!");
      })
      .catch((error) =>
        console.error("Error registering user:", error.message)
      );
  });

// Search functionality
document
  .getElementById("searchInput")
  .addEventListener("input", function (event) {
    const searchTerm = event.target.value.trim().toLowerCase();

    // Fetch data from the server and filter based on the search term
    fetch("/books")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.querySelector("#bookTable tbody");
        tableBody.innerHTML = ""; // Clear existing table rows

        data.forEach((book) => {
          // Check if the book title contains the search term
          if (book.book_title.toLowerCase().includes(searchTerm)) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${book.book_id}</td><td>${book.book_title}</td><td>${book.book_total_page}</td>
                <td>${book.rating}</td><td>${book.isbn}</td><td>${book.published_date}</td><td>${book.publisher_id}</td>`;
            tableBody.appendChild(row);
          }
        });
      })
      .catch((error) =>
        console.error("Error fetching and filtering data:", error)
      );
  });

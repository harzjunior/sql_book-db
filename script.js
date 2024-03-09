// Check if the user is logged in (replace 'isLoggedIn' with your actual authentication check)
const isLoggedIn = true; /* your authentication check here */

if (isLoggedIn) {
  document.getElementById("authenticatedContent").style.display = "block";
}

// Function to show the login modal
function showLoginModal() {
  const loginModal = document.getElementById("loginModal");
  loginModal.style.display = "block";

  //hide nav buttons and search
  const headerModal = document.getElementById("headerButtons");
  headerModal.style.display = "none";
}

// Function to close the registration modal
function closeLoginModal() {
  const registerModal = document.getElementById("loginModal");
  registerModal.style.display = "none";

  //show nav buttons and search
  const headerModal = document.getElementById("headerButtons");
  headerModal.style.display = "block";
}

// Function to show the registration modal
function showRegisterModal() {
  const registerModal = document.getElementById("registerModal");
  registerModal.style.display = "block";

  //hide nav buttons and search
  const headerModal = document.getElementById("headerButtons");
  headerModal.style.display = "none";
}

// Function to close the registration modal
function closeRegisterModal() {
  const registerModal = document.getElementById("registerModal");
  registerModal.style.display = "none";

  //show nav buttons and search
  const headerModal = document.getElementById("headerButtons");
  headerModal.style.display = "block";
}

// Show login modal when "log into an Account" button is clicked
document.getElementById("loginBtn").addEventListener("click", showLoginModal);

// Close the registration modal when the close button is clicked
document
  .getElementById("closeLoginModal")
  .addEventListener("click", closeLoginModal);

// Show registration modal when "Create Account" button is clicked
document
  .getElementById("createBtn")
  .addEventListener("click", showRegisterModal);

// Close the registration modal when the close button is clicked
document
  .getElementById("closeRegisterModal")
  .addEventListener("click", closeRegisterModal);

// Close the registration modal when clicking outside the modal
window.addEventListener("click", (event) => {
  const registerModal = document.getElementById("registerModal");
  if (event.target === registerModal) {
    closeRegisterModal();
  }
});

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

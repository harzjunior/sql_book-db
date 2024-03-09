import mysql.connector
from random_book_generator import generate_random_book
import time

# Connect to your MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="book_db"
)
cursor = db.cursor()

# Function to insert a book into the database
def insert_book(book):
    query = "INSERT INTO books (book_title, book_total_page, rating, isbn, published_date, publisher_id) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (book["title"], book["total_pages"], book["rating"], book["isbn"], book["published_date"], book["publisher_id"])

    cursor.execute(query, values)
    db.commit()

# URL of your server
url = "http://localhost:3000/books"  # Replace with your actual server URL

try:
    while True:
        # Generate a random book
        random_book = generate_random_book()

        # Insert the random book into the local database
        insert_book(random_book)

        # Make a POST request to add the book to the server
        # response = requests.post(url, json=random_book)

        # Print the response (optional)
        # print(insert_book(random_book)) #post with 2 null fields to the database

        # Wait for 60 seconds before the next iteration
        time.sleep(2)
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Close the database connection in the cleanup section
    cursor.close()
    db.close()

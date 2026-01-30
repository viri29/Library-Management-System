# Library-Management-System (CSE5720)

## Description
Easy and convenient library management app for students, faculty and librarians to browse books and keep up with general library records. 

## Features
- Explore books by category, author, or title.
- Check borrowing info such as due dates, return info, and borrowing history.
- Reserve books in advance.
- View any pending fines.

## Project Structure
```
Library-Management-System/
│
├── public/
│   ├── account.html
│   ├── books.html
│   ├── borrowings.html
│   ├── fines.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── reservations.html
│   ├── styles.css
├── .env
├── .gitignore
├── db.js
├── package-lock.json
├── package.json
├── README.md
└── server.js

```

## How to Run
### Requirement
```
- Node.js (v18 or later recommended)
- npm
- MySQL (MySQL Workbench or local installation)
```
### Database Schema

### Setup
1. Clone the repository
2. Install dependencies in the root directory
```
npm install
```
3. Create a .env file in the root directory and add
```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=library_db
PORT=3000
```
(adjust values based on your MySQL setup)

4. Set up the database
5. Start the server
```
node index.js
```
## Future Improvements
1. More details on book tiles (images, descriptions, ratings, etc.)
2. Pay fees/fines online.
3. Add search filters.
4. Reminder alerts for book pickups and book returns.

## Technologies Used
- JavaScript
- HTML/CSS
- Node.js
- MySQL
- Express.js
- CORS
- dotenv
- bcrypt

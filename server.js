const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const db = require('./db');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


///////////REGISTER USER ROUTES/////////////////
//receive a request for register.html page
app.get('/register.html', (req, res) => {
  res.sendFile(dirname+"/"+"register.html");
});

//save user registration info to table
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  //check if email already exists
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error. Cannot verify email.'});
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const insertSql = "INSERT INTO Users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)";
    const values = [firstName, lastName, email, hashedPassword, role];

    db.query(insertSql, values, function (err, result) {
      if (err) {
        console.error("Error inserting data: ", err);
        return res.status(500).json({ messsage: "An error occurred while registering." });
      } else {
        console.log("1 record inserted.");
        return res.status(200).json({ message: "Account successfully created!" });      
      }
    });
  } catch (err) {
    console.error("Error hashing password: ", err);
    return res.status(500).json({ message: "Error processing request." });
  }
})
});

///////////LOGIN USER ROUTES/////////////////
//receive a request for login.html page
app.get('/login.html', (req, res) => {
  res.sendFile(dirname+"/"+"login.html");
});

//log user in
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error. Cannot locate email.' });
    }
  
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0]; //define user

    try {
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      //successful login
      return res.status(200).json({
        message: 'Login successful!',
        userId: user.userID,
        role: user.role
      });
    } catch (err) {
      console.error("Password comparison error:", err);
        return res.status(500).json({ message: 'Error checking password.' });
    }
  });
});

////////BOOKS PAGE ROUTES///////////
//fetch all books
app.get('/books', (req, res) => {
  const sql = `
    SELECT Book.bookID, Book.title, Book.author, Book.publicationYear, Category.categoryName
    FROM Book
    JOIN Category ON Book.categoryID = Category.categoryID
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err.message);
      return res.status(500).json({ message: 'Error fetching books.' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

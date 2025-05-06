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
app.use(express.static('public'));
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

////////BOOKS ROUTES///////////
//fetch all books
app.get('/books', (req, res) => {
  const sql = `
    SELECT b.bookID, b.title, b.author, b.publicationYear, c.categoryName
    FROM Books b
    JOIN Categories c ON b.categoryID = c.categoryID
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Books SQL Error:', err.message);
      return res.status(500).json({ message: 'Error fetching books' });
    }
    res.json(results);
  });
});


//////////////BORROWINGS ROUTE////////////
app.get('/borrowings', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    console.log("Missing userId");
    return res.status(400).json({ message: 'User ID required' });
  }

  const sql = `
    SELECT b.title, bt.issueDate, bt.dueDate, bt.returnDate, bt.fine
    FROM BorrowingTransactions bt
    JOIN Books b ON bt.bookID = b.bookID
    WHERE bt.userID = ?
    ORDER BY bt.issueDate DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      return res.status(500).json({ message: 'Error fetching borrowings' });
    }

    res.json(results);
  });
});


/////////RESERVATIONS ROUTE/////////////
app.get('/reservations', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  const sql = `
    SELECT b.title, r.reservationDate, r.status
    FROM Reservations r
    JOIN Books b ON r.bookID = b.bookID
    WHERE r.userID = ?
    ORDER BY r.reservationDate DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Reservations SQL Error:", err.message);
      return res.status(500).json({ message: 'Error fetching reservations' });
    }

    res.json(results);
  });
});


//////////FINES ROUTE//////////////////
app.get('/fines', (req, res) => {
  const userId = req.query.userId;

  if(!userId) {
    return res.status(400).json({ message: 'User ID required. '});
  }

  const sql = `
  SELECT b.title, f.amount, f.Status
  FROM Fines f
  JOIN BorrowingTransactions bt ON f.transactionID = bt.transactionID
  JOIN Books b ON bt.bookID = b.bookID
  WHERE bt.userID = ?
  ORDER BY f.amount DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Fines SQL Error:", err.message);
      return res.status(500).json({ message: 'Error fetching reservations' });
    }

    res.json(results);
  })
})

///////////////ACCOUNT ROUTES////////////
//fetching account user details: name, email, role
app.get('/account', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID required' });
  }

  const sql = `
    SELECT firstName, lastName, email, role
    FROM Users
    WHERE userID = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Account SQL Error:", err.message);
      return res.status(500).json({ message: 'Error fetching user info' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});
//fetching account summary details: pending fines, pending reservations, completed reservations
app.get('/account/summary', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'User ID required' });

  const sql = `
    SELECT
      (SELECT COUNT(*) FROM Reservations WHERE userID = ? AND status = 'Pending') AS pendingReservations,
      (SELECT COUNT(*) FROM Reservations WHERE userID = ? AND status = 'Completed') AS completedReservations,
      (SELECT IFNULL(SUM(amount), 0.00) FROM Fines f
        JOIN BorrowingTransactions bt ON f.transactionID = bt.transactionID
        WHERE bt.userID = ? AND f.status = 'Unpaid') AS totalUnpaidFines
  `;

  db.query(sql, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Summary SQL Error:', err.message);
      return res.status(500).json({ message: 'Error fetching summary' });
    }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

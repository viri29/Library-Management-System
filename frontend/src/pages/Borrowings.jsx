import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Borrowings() {
  const { userId } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/borrowings?userId=${userId}`)
      .then(setBorrowings)
      .catch((err) => {
        console.error('Error fetching borrowings:', err);
        setError(true);
      })
      .finally(() => setLoaded(true));
  }, [userId]);

  return (
    <section className="sections">
      <h2>Your Borrowed Books</h2>
      <div className="book-grid">
        {error && <p>Something went wrong loading your borrowings.</p>}
        {!error && loaded && borrowings.length === 0 && <p>No current borrowings found.</p>}
        {borrowings.map((tx, i) => (
          <div className="book-card" key={i}>
            <h3>{tx.title}</h3>
            <p><strong>Issued:</strong> {tx.issueDate.slice(0, 10)}</p>
            <p><strong>Due:</strong> {tx.dueDate.slice(0, 10)}</p>
            <p><strong>Returned:</strong> {tx.returnDate ? tx.returnDate.slice(0, 10) : 'Not yet'}</p>
            <p><strong>Fine:</strong> ${Number(tx.fine || 0).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

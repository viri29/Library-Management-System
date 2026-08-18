import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Fines() {
  const { userId } = useAuth();
  const [fines, setFines] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/fines?userId=${userId}`)
      .then(setFines)
      .catch((err) => {
        console.error('Error loading fines:', err);
        setError(true);
      })
      .finally(() => setLoaded(true));
  }, [userId]);

  return (
    <section className="sections">
      <h2>Your Fines</h2>
      <div className="book-grid">
        {error && <p>Failed to load fines.</p>}
        {!error && loaded && fines.length === 0 && <p>No outstanding fines.</p>}
        {fines.map((fine, i) => (
          <div className="book-card" key={i}>
            <h3>{fine.title}</h3>
            <p><strong>Amount:</strong> ${fine.amount ? Number(fine.amount).toFixed(2) : '0.00'}</p>
            <p className={`Status-${fine.Status}`}><strong>Status:</strong> {fine.Status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

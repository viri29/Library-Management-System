import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Reservations() {
  const { userId } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadReservations = useCallback(() => {
    api.get(`/reservations?userId=${userId}`)
      .then((data) => {
        setReservations(data);
        setError(false);
      })
      .catch((err) => {
        console.error('Error loading reservations:', err);
        setError(true);
      })
      .finally(() => setLoaded(true));
  }, [userId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const cancelReservation = async (reservationID) => {
    setCancellingId(reservationID);

    try {
      const data = await api.put('/reservations/cancel', { reservationID });
      alert(data.message);
      loadReservations();
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  };

  return (
    <section className="sections">
      <h2>Your Book Reservations</h2>
      <div className="book-grid">
        {error && <p>Failed to load reservations.</p>}
        {!error && loaded && reservations.length === 0 && <p>No current reservations.</p>}
        {reservations.map((r) => (
          <div className="book-card" key={r.reservationID}>
            <h3>{r.title}</h3>
            <p><strong>Date:</strong> {r.reservationDate.slice(0, 10)}</p>
            <p className={`status-${r.status}`}><strong>Status:</strong> {r.status}</p>
            {r.status === 'Pending' && (
              confirmingId === r.reservationID ? (
                <div className="cancel-confirm">
                  <p>Cancel this reservation?</p>
                  <button
                    className="hero-btn cancel-btn"
                    onClick={() => cancelReservation(r.reservationID)}
                    disabled={cancellingId === r.reservationID}
                  >
                    {cancellingId === r.reservationID ? 'Cancelling…' : 'Yes, cancel'}
                  </button>
                  <button className="hero-btn" onClick={() => setConfirmingId(null)}>
                    Keep it
                  </button>
                </div>
              ) : (
                <button className="hero-btn cancel-btn" onClick={() => setConfirmingId(r.reservationID)}>
                  Cancel
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

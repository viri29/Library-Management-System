import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/account?userId=${userId}`),
      api.get(`/account/summary?userId=${userId}`),
    ])
      .then(([userData, summaryData]) => {
        if (!userData || !userData.firstName) throw new Error('User not found.');
        setUser(userData);
        setSummary(summaryData);
      })
      .catch((err) => {
        console.error('Error loading account or summary:', err);
        setError(true);
      });
  }, [userId]);

  return (
    <section className="sections">
      <h2>Your Account</h2>
      <div className="center-wrap">
        <div className="auth-container">
          {error && <p>Could not load account info.</p>}
          {!error && user && summary && (
            <>
              <h3>{user.firstName} {user.lastName}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <hr style={{ margin: '20px 0' }} />
              <h4>📊 Summary</h4>
              <p><strong>Pending Reservations:</strong> {summary.pendingReservations}</p>
              <p><strong>Completed Reservations:</strong> {summary.completedReservations}</p>
              <p><strong>Total Unpaid Fines:</strong> ${parseFloat(summary.totalUnpaidFines).toFixed(2)}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

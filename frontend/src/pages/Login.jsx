import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await api.post('/login', { email, password });
      alert(data.message);
      login(data.userId, data.role);

      const redirectTo = location.state?.from;
      navigate(redirectTo || '/');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.message || 'Login failed.');
    }
  };

  return (
    <section className="auth-section gradient-pink">
      <div className="auth-container">
        <h2>Login to Your Account</h2>
        {location.state?.notice && <p className="page-message error">{location.state.notice}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="hero-btn">Login</button>
          <p className="switch-link">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  confirm: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const data = await api.post('/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      alert(data.message);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message || 'Registration failed.');
    }
  };

  return (
    <section className="auth-section gradient-blue">
      <div className="auth-container">
        <h2>Create an Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={form.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <select name="role" required value={form.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            required
            value={form.confirm}
            onChange={handleChange}
          />
          <button type="submit" className="hero-btn">Register</button>
          <p className="switch-link">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </section>
  );
}

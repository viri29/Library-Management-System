import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">📚 MyLibrary</div>
      <ul className="nav-menu">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/books">Books</NavLink></li>
        <li><NavLink to="/borrowings">Borrowing History</NavLink></li>
        <li><NavLink to="/reservations">Reservations</NavLink></li>
        <li><NavLink to="/fines">Fines</NavLink></li>
        <li><NavLink to="/account">Account</NavLink></li>
        {!isLoggedIn && <li><NavLink to="/login">Login</NavLink></li>}
        {!isLoggedIn && <li><NavLink to="/register">Register</NavLink></li>}
        {isLoggedIn && <li><a href="#" onClick={handleLogout}>Logout</a></li>}
      </ul>
    </nav>
  );
}

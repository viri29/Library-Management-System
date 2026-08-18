import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import Borrowings from './pages/Borrowings';
import Reservations from './pages/Reservations';
import Fines from './pages/Fines';
import Account from './pages/Account';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Books />} />
          <Route
            path="/borrowings"
            element={
              <RequireAuth>
                <Borrowings />
              </RequireAuth>
            }
          />
          <Route
            path="/reservations"
            element={
              <RequireAuth>
                <Reservations />
              </RequireAuth>
            }
          />
          <Route
            path="/fines"
            element={
              <RequireAuth>
                <Fines />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

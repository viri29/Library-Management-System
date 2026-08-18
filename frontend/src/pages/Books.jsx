import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [reservedBookIds, setReservedBookIds] = useState(new Set());
  const { userId, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/books')
      .then(setBooks)
      .catch((err) => console.error('Error fetching books:', err))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setReservedBookIds(new Set());
      return;
    }

    api.get(`/reservations?userId=${userId}`)
      .then((data) => {
        const pendingIds = data.filter((r) => r.status === 'Pending').map((r) => r.bookID);
        setReservedBookIds(new Set(pendingIds));
      })
      .catch((err) => console.error('Error fetching reservations:', err));
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const keyword = search.toLowerCase();
  const filtered = books.filter(
    (book) =>
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      book.categoryName.toLowerCase().includes(keyword)
  );

  const reserveBook = async (bookID, title) => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: { from: location.pathname, notice: 'Please log in to reserve a book.' },
      });
      return;
    }

    if (reservedBookIds.has(bookID)) {
      setMessage({ type: 'error', text: `You already have "${title}" reserved.` });
      return;
    }

    try {
      const data = await api.post('/reserve', { userID: userId, bookID });
      setMessage({ type: 'success', text: data.message || `Reserved "${title}" successfully!` });
      setReservedBookIds((prev) => new Set(prev).add(bookID));
    } catch (err) {
      console.error('Reservation error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to reserve the book.' });
    }
  };

  return (
    <section className="sections">
      <h2>Explore Our Collection</h2>

      {message && <p className={`page-message ${message.type}`}>{message.text}</p>}

      <input
        type="text"
        placeholder="Search by Title, Author, or Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="book-grid">
        {loaded && filtered.length === 0 && <p>No books found.</p>}
        {filtered.map((book) => (
          <div className="book-card" key={book.bookID}>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.categoryName}</p>
              <p><strong>Published:</strong> {book.publicationYear}</p>
            </div>
            <button
              className="hero-btn"
              onClick={() => reserveBook(book.bookID, book.title)}
              disabled={reservedBookIds.has(book.bookID)}
            >
              {reservedBookIds.has(book.bookID) ? 'Reserved' : 'Reserve'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="hero-text">
          <h1>Welcome to MyLibrary</h1>
          <p>Book reservations made easy, fast, convenient.</p>
          <br />
          <Link to="/books" className="hero-btn">Start Browsing</Link>
        </div>
      </header>

      <section className="sections">
        <h2>Quick Access</h2>
        <div className="card-container">
          <Link to="/books" className="card gradient-blue">
            <h3>📖 Books</h3>
            <p>Explore the collection by category, author, or title.</p>
          </Link>

          <Link to="/borrowings" className="card gradient-pink">
            <h3>📅 Borrowings</h3>
            <p>Check due dates, return info, and borrowing history.</p>
          </Link>

          <Link to="/reservations" className="card gradient-green">
            <h3>🔒 Reservations</h3>
            <p>Reserve books before they’re gone!</p>
          </Link>

          <Link to="/fines" className="card gradient-orange">
            <h3>💸 Fines</h3>
            <p>View any pending library fines.</p>
          </Link>
        </div>
      </section>
    </>
  );
}

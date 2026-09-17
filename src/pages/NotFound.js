import { Link } from "react-router";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link to="/" className="not-found-btn">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
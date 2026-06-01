import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <h1>Scalable REST API with Authentication &amp; Role-Based Access</h1>
      <p className="lead">
        Register, log in, and manage tasks. Admins can view all tasks and manage users.
      </p>
      {isAuthenticated ? (
        <Link to="/dashboard" className="btn btn-primary">
          Go to dashboard
        </Link>
      ) : (
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Get started
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Log in
          </Link>
        </div>
      )}
    </section>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children, requiredRole }) {
  const { auth } = useAuth();

  // Not logged in -> login page
  if (!auth.token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role -> events page
  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default ProtectedRoute;

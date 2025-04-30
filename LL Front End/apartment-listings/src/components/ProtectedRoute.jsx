import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const params = useParams();

  // Optional: show spinner or null while auth state is loading
  if (loading) return null;

  // If not logged in, redirect to public home
  if (!user) {
    return <Navigate to="/home" replace />;
  }

  // If a uid param exists, ensure it matches the current user
  if (params.uid && user.id !== params.uid) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise, render the protected children
  return children;
}
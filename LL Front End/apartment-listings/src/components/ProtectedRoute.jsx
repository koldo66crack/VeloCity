import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import GemSpinner from './GemSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const params = useParams();
  const location = useLocation();

  // Show gem spinner while auth state is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <GemSpinner 
          message="Loading your account..."
          size="large"
          variant="data"
        />
      </div>
    );
  }

  // If not logged in, redirect to public home with redirect param
  if (!user) {
    const currentPath = location.pathname + location.search;
    return <Navigate to={`/home?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  // If a uid param exists, ensure it matches the current user
  if (params.uid && user.id !== params.uid) {
    return <Navigate to={`/home/${user.id}`} replace />;
  }

  // Otherwise, render the protected children
  return children;
}
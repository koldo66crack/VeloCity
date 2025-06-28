import { useAuth } from '../store/useAuth';

/**
 * Smart navigation utility that redirects users to the appropriate home page
 * based on their authentication status
 */
export const useSmartNavigation = () => {
  const { user } = useAuth();
  
  const navigateToHome = (navigate) => {
    if (user && user.id) {
      // User is logged in - go to their personal home page
      navigate(`/home/${user.id}`);
    } else {
      // User is not logged in - go to public home page
      navigate('/home');
    }
  };

  const goBackToListings = (navigate) => {
    if (user && user.id) {
      // User is logged in - go to their personal listings page
      navigate(`/home/${user.id}`);
    } else {
      // User is not logged in - go to public listings page
      navigate('/home');
    }
  };

  return { navigateToHome, goBackToListings };
};

/**
 * Get the appropriate home URL based on user authentication status
 * Useful for Link components or when you need the URL string
 */
export const getHomeUrl = (user) => {
  if (user && user.id) {
    return `/home/${user.id}`;
  }
  return '/home';
}; 
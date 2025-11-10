// Smart filter tracking service
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Track smart filter usage
export const trackSmartFilterUsage = async (feature, action, context = null) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate anonymous ID for non-logged-in users
    let userId = user?.id;
    let isAnonymous = false;
    
    if (!userId) {
      // Create or get anonymous user ID from localStorage
      let anonymousId = localStorage.getItem('anonymousUserId');
      if (!anonymousId) {
        anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('anonymousUserId', anonymousId);
      }
      userId = anonymousId;
      isAnonymous = true;
    }

    const response = await fetch(`${API_BASE_URL}/api/smart-filters/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        feature,
        action,
        context: {
          ...context,
          isAnonymous,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to track smart filter usage');
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking smart filter usage:', error);
    // Don't throw - we don't want tracking errors to break the UI
  }
};

// Get user's smart filter usage history
export const getUserSmartFilterHistory = async (limit = 50) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    let userId = user?.id;
    
    if (!userId) {
      // Get anonymous user ID from localStorage
      const anonymousId = localStorage.getItem('anonymousUserId');
      if (!anonymousId) {
        return { usage: [] };
      }
      userId = anonymousId;
    }

    const response = await fetch(`${API_BASE_URL}/api/smart-filters/user/${userId}?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user smart filter history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching smart filter history:', error);
    return { usage: [] };
  }
};

// Get analytics (for admin/insights)
export const getSmartFilterAnalytics = async (days = 30, limit = 20) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/smart-filters/analytics?days=${days}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch smart filter analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching smart filter analytics:', error);
    return { topFeatures: [], actionStats: [], recentSearches: [] };
  }
};

// Track feature addition
export const trackFeatureAdded = (feature, context = null) => {
  return trackSmartFilterUsage(feature, 'added', context);
};

// Track feature removal
export const trackFeatureRemoved = (feature, context = null) => {
  return trackSmartFilterUsage(feature, 'removed', context);
};

// Track search query
export const trackSearchQuery = (query, context = null) => {
  return trackSmartFilterUsage(query, 'searched', context);
}; 
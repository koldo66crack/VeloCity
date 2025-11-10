import React, { useState, useEffect } from 'react';
import { getSmartFilterAnalytics } from '../services/smartFilterTracking';

const SmartFilterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getSmartFilterAnalytics(30, 20);
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900 rounded-lg">
        <h3 className="text-red-200 font-medium">Error loading analytics</h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">User Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {analytics.userStats?.totalUsers || 0}
            </div>
            <div className="text-gray-300 text-sm">Total Users</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {analytics.userStats?.loggedInUsers || 0}
            </div>
            <div className="text-gray-300 text-sm">Logged In Users</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {analytics.userStats?.anonymousUsers || 0}
            </div>
            <div className="text-gray-300 text-sm">Anonymous Users</div>
          </div>
        </div>
      </div>

      {/* Top Features */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Most Popular Features</h3>
        <div className="space-y-3">
          {analytics.topFeatures?.map((feature, index) => (
            <div key={feature.feature} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="text-green-400 font-medium">#{index + 1}</div>
                <div className="text-white capitalize">{feature.feature}</div>
              </div>
              <div className="text-gray-300 text-sm">
                {feature._count.feature} uses
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Usage by Action</h3>
        <div className="space-y-3">
          {analytics.actionStats?.map((stat) => (
            <div key={stat.action} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <div className="text-white capitalize">{stat.action}</div>
              <div className="text-gray-300 text-sm">
                {stat._count.action} times
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Searches</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {analytics.recentSearches?.map((search, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3">
              <div className="text-white font-medium">{search.feature}</div>
              <div className="text-gray-400 text-sm">
                {new Date(search.createdAt).toLocaleDateString()}
              </div>
              {search.context && (
                <div className="text-gray-500 text-xs mt-1">
                  Context: {JSON.stringify(search.context)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartFilterAnalytics; 
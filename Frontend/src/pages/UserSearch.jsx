import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

export default function UserSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/users/search?query=${encodeURIComponent(query)}`);
        setUsers(res.data);
      } catch (err) {
        setError('Failed to search users');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Trigger search on query change
  useEffect(() => {
    debouncedSearch(searchQuery);
    
    // Cleanup
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(
        `/api/users/${action}/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update users list with new following status
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? {
                ...user,
                followers: isFollowing
                  ? user.followers.filter(id => id !== currentUser?._id)
                  : [...user.followers, currentUser?._id]
              }
            : user
        )
      );
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert(err.response?.data?.message || 'Failed to update follow status');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && searchQuery && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.map(user => {
          const isFollowing = user.followers.includes(currentUser?._id);
          const isCurrentUser = user._id === currentUser?._id;

          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* User Info */}
              <div
                className="flex items-center space-x-3 flex-1 cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  {user.bio && (
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              {!isCurrentUser && (
                <button
                  onClick={() => handleFollowToggle(user._id, isFollowing)}
                  className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium ${
                    isFollowing
                      ? 'border border-gray-300 hover:bg-gray-50'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!searchQuery && !isLoading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Search for users
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Find people to follow and connect with
          </p>
        </div>
      )}
    </div>
  );
}
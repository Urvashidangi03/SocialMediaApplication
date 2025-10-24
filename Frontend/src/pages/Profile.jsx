import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

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

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch user profile data
        const userRes = await axios.get(`/api/users/${username}`);
        setUser(userRes.data);
        setIsFollowing(userRes.data.followers.includes(currentUser?._id));

        // Fetch user posts
        const postsRes = await axios.get(`/api/posts/user/${username}`);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserAndPosts();
    }
  }, [username, currentUser?._id]);

  const handleFollowToggle = async () => {
    try {
      if (!user || !currentUser) return;

      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`/api/users/${action}/${user._id}`, {}, { withCredentials: true });
      
      setUser(prev => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }));
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert(err.response?.data?.message || 'Error updating follow status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!user) return null;

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Profile Picture */}
        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <img
            src={user.profilePicture || '/default-avatar.png'}
            alt={`${user.username}'s profile`}
            className="w-full h-full rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isFollowing
                    ? 'border border-gray-300 hover:bg-gray-50'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <div className="text-center md:text-left">
              <span className="font-semibold">{posts.length}</span>
              <span className="text-gray-500 ml-1">posts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-semibold">{user.followers.length}</span>
              <span className="text-gray-500 ml-1">followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-semibold">{user.following.length}</span>
              <span className="text-gray-500 ml-1">following</span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="whitespace-pre-wrap text-sm">
              {user.bio}
            </div>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map(post => (
          <div
            key={post._id}
            className="relative pt-[100%]"
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <img
              src={post.image}
              alt={post.caption}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-4 text-white">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Posts Message */}
      {posts.length === 0 && (
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
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
          {isOwnProfile && (
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
          )}
        </div>
      )}
    </div>
  );
}
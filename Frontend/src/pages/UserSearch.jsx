import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`http://localhost:3000/users/search?query=${encodeURIComponent(query)}`, {
        withCredentials: true
      })
      setUsers(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search users')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      <div className="grid gap-4">
        {users.map(user => (
          <div key={user._id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && users.length === 0 && query && (
        <div className="text-center py-8 text-gray-600">
          No users found matching your search
        </div>
      )}
    </div>
  )
}

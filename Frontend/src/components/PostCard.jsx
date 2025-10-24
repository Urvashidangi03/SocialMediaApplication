import axios from 'axios'

export default function PostCard({ id,username, avatarUrl, postImage, likesCount, caption, comments = [].setPosts }) {
  const preview = Array.isArray(comments) ? comments.slice(0, 2) : []

  const likePost = () => {
    axios.post("http://localhost:3000/like",{
      post: id
    },{withCredentials:true}).then(response=>{
      console.log(response.data)
      setPosts(prevPosts => prevPosts.map(post => post._id === id ? { ...post, likeCount: response.data.isLiked ? post.likeCount + 1 : post.likeCount - 1 } : post))
    })
  }

  return (
    <article className="post card">
      <header className="post-header">
        <img className="avatar" src={avatarUrl} alt={`${username} avatar`} />
        <div className="user">
          <strong className="username">{username}</strong>
        </div>
      </header>

      <div className="post-media">
        <img className="post-image" src={postImage} alt="Post media" />
      </div>

      <div className="post-actions" aria-label="Post actions">
        <button onClick={likePost} className="icon-btn" aria-label="Like">❤️</button>
        <button className="icon-btn" aria-label="Comment">💬</button>
        <button className="icon-btn" aria-label="Share">📤</button>
      </div>

      <div className="post-body">
        <div className="likes">{Number(likesCount).toLocaleString()} likes</div>
        <div className="caption">
          <strong className="username">{username}</strong>
          <span> {caption}</span>
        </div>
        <div className="post-comments">
          {preview.map((c, idx) => (
            <div key={idx} className="comment">
              <strong className="username">{c.user}</strong>
              <span> {c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
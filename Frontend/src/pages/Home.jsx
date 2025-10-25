// const posts = [
//   {
//     id: 1,
//     user: { name: 'alex', avatar: 'https://i.pravatar.cc/100?img=12' },
//     image: 'https://picsum.photos/id/1011/1200/900',
//     likes: 128,
//     caption: 'Exploring golden hour trails and capturing the calm between the chaos. The light just hits different today.',
//     comments: [
//       { user: 'mira', text: 'The colors are unreal. Love this shot!' },
//       { user: 'devon', text: 'Okay now I need to go outside 😅' },
//       { user: 'sam', text: 'Where is this? Looks peaceful.' },
//     ],
//   },
//   {
//     id: 2,
//     user: { name: 'jordan', avatar: 'https://i.pravatar.cc/100?img=32' },
//     image: 'https://images.unsplash.com/photo-1729701163957-85ba5dc5b971?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8',
//     likes: 342,
//     caption: 'Weekend ritual: coffee, vinyl, and a good book. Reset mode engaged.',
//     comments: [
//       { user: 'alex', text: 'This is the vibe 🔥' },
//       { user: 'riley', text: 'What record is that? Cover looks dope.' },
//     ],
//   },
//   {
//     id: 3,
//     user: { name: 'sana', avatar: 'https://i.pravatar.cc/100?img=5' },
//     image: 'https://images.unsplash.com/photo-1754951433192-cf5d42c3d3c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D',
//     likes: 89,
//     caption: 'Tiny moments, big memories. Filed under “joy I didn’t plan for.”',
//     comments: [
//       { user: 'jordan', text: 'This made my day 🫶' },
//       { user: 'lee', text: 'The composition is perfect.' },
//     ],
//   },
// ]

import PostCard from '../components/PostCard.jsx'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Home() {

  const [posts, setPosts] = useState([])

  useEffect(()=>{
    console.log("Fetching posts...");
    axios.get("http://localhost:3001/posts?skip=0&limit=20",{withCredentials:true}).then(response=>{
      console.log("Posts response:", response.data);
      console.log("Response structure:", {
        message: response.data.message,
        postsCount: response.data.posts ? response.data.posts.length : 0,
        samplePost: response.data.posts && response.data.posts[0] ? {
          id: response.data.posts[0]._id,
          image: response.data.posts[0].image,
          caption: response.data.posts[0].caption,
          user: response.data.posts[0].user,
          likeCount: response.data.posts[0].likeCount
        } : null
      });
      
      if (response.data.posts && Array.isArray(response.data.posts)) {
        if (response.data.posts.length === 0) {
          console.log("No posts found in the database");
        }
        setPosts(response.data.posts);
      } else {
        console.error("Invalid posts data structure:", response.data);
        setPosts([]);
      }
    }).catch(error => {
      console.error("Error fetching posts:", error);
      setPosts([]);
    })
  },[])

  return (
    <div className="container">
      <div className="feed" aria-label="Home feed">
        {posts.map(post => (
          <PostCard
            key={post._id}
            id={post._id}
            username={post.user.username}
            avatarUrl={post.user.image}
            postImage={post.image}
            likesCount={post.likeCount}
            caption={post.caption}
            comments={post.comments}
            setPosts={setPosts}
          />
        ))}
      </div>
    </div>
  )
}
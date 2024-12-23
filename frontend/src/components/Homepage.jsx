import { useEffect, useState } from "react";
import Post from "./Post";

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetch('http://localhost:8000/post')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return response.json();
      })
      .then(posts => {
        setPosts(posts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if the fetch fails
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => <Post key={post._id} {...post} />) // Use key prop for efficient rendering
      ) : (
        <div>No posts available</div> // Handle empty posts state
      )}
    </div>
  );
}

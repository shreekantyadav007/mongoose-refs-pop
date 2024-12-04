import React, { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import PostForm from "./components/PostForm";
import { fetchPosts, fetchUsers } from "./services/api";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handlePostCreated = async (newPost) => {
    // Refetch posts to get the populated post with user details
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const initialPosts = await fetchPosts();
        setPosts(initialPosts);

        // Extract unique users 
        const allUsers = await fetchUsers();

        const uniqueUsers = [...new Set(allUsers.map((user) => user))];
        setUsers(uniqueUsers);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [users]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">
        Mongoose Referencing Demo
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <UserForm onUserCreated={handleUserCreated} />
        <PostForm users={users} onPostCreated={handlePostCreated} />
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts yet</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <div className="text-sm text-gray-500">
                  <strong>Author:</strong> {post.author.name} (
                  {post.author.email})
                </div>
                <div className="text-sm text-gray-400">
                  Created: {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

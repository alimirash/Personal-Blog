import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../api/index';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) return <div className="text-center p-4">Loading posts...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <Link to="/blog/create" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Create New Post
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">No posts found. Be the first to create one!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
              {post.featured_image && (
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  By {post.author.username} • {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {post.content.substr(0, 100)}...
                </p>
                <Link to={`/blog/${post.id}`} className="text-purple-600 dark:text-purple-400 font-medium">
                  Read more →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;

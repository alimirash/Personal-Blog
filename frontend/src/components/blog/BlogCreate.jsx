import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/index';
import { WalletContext } from '../../context/WalletContext';

const BlogCreate = () => {
  const navigate = useNavigate();
  const { isConnected, contract } = useContext(WalletContext);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      if (useBlockchain && isConnected && contract) {
        // Create post on blockchain
        const tx = await contract.createPost(title, content);
        await tx.wait();
        
        alert('Post created on blockchain successfully!');
        navigate('/blog');
      } else {
        // Create post on backend
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
          formData.append('featured_image', image);
        }
        
        const response = await createPost(formData);
        navigate(`/blog/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter post title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write your post content here..."
            rows="10"
            required
          ></textarea>
        </div>
        
        {!useBlockchain && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="image">
              Featured Image (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        
        {isConnected && (
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={(e) => setUseBlockchain(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Store on blockchain (costs gas)</span>
            </label>
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreate;

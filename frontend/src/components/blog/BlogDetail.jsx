import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, addComment, deletePost } from '../../api/index';
import { WalletContext } from '../../context/WalletContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, account, contract } = useContext(WalletContext);

  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipAmount, setTipAmount] = useState('0.01');

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetchPost(id);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError('Failed to load post details. Please try again later.');
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (commentContent.trim() === '') return;

    try {
      const response = await addComment(id, { content: commentContent });
      setPost({
        ...post,
        comments: [...post.comments, response.data]
      });
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleTip = async () => {
    if (!isConnected || !contract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const ethAmount = ethers.utils.parseEther(tipAmount);
      const tx = await contract.tipPost(post.id, { value: ethAmount });
      await tx.wait();
      alert(`Thank you for your tip of ${tipAmount} ETH!`);
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip. Please try again.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading post...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!post) return <div className="text-center p-4">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {post.featured_image && (
        <img 
          src={post.featured_image} 
          alt={post.title} 
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          By {post.author.username} • {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        {isConnected && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="w-20 p-1 border rounded"
            />
            <button 
              onClick={handleTip}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Tip ETH
            </button>
          </div>
        )}
      </div>
      
      <div className="prose dark:prose-invert max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
      
      {post.author.username === (account ? account : null) && (
        <div className="flex space-x-2 mb-8">
          <button 
            onClick={() => navigate(`/blog/${id}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments ({post.comments.length})</h2>
        
        {isConnected && (
          <form onSubmit={handleComment} className="mb-6">
            <div className="mb-2">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded"
                rows="3"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Post Comment
            </button>
          </form>
        )}
        
        <div className="space-y-4">
          {post.comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 dark:text-white">{comment.author.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

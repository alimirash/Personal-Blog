import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add authentication token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Blog Post API calls
export const fetchPosts = () => API.get('/posts/');
export const fetchPost = (id) => API.get(`/posts/${id}/`);
export const createPost = (newPost) => API.post('/posts/', newPost);
export const updatePost = (id, updatedPost) => API.put(`/posts/${id}/`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}/`);

// Comment API calls
export const addComment = (postId, comment) => API.post(`/posts/${postId}/add_comment/`, comment);
export const deleteComment = (id) => API.delete(`/comments/${id}/`);

// Auth API calls
export const signIn = (formData) => API.post('/auth/login/', formData);
export const signUp = (formData) => API.post('/auth/register/', formData);

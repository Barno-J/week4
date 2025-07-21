import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useMutation } from '@tanstack/react-query';

const BlogPage = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Blog state
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with MERN Stack',
      content: 'Learn how to build full-stack applications with MongoDB, Express, React, and Node.js.',
      author: 'John Doe',
      date: '2023-05-15',
      category: 'Development'
    },
    {
      id: 2,
      title: 'React Hooks Explained',
      content: 'A deep dive into React Hooks and how they simplify state management in functional components.',
      author: 'Jane Smith',
      date: '2023-05-10',
      category: 'React'
    }
  ]);
  const [categories, setCategories] = useState(['Development', 'React', 'JavaScript', 'Node.js']);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPost, setCurrentPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  const { mutate: loginMutation, isError } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setIsLoggedIn(true);
      setShowLogin(false);
      setAuthForm({ username: '', email: '', password: '' });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
      setShowLogin(true);
      setAuthForm({ username: '', email: '', password: '' });
    }
  });

  // Dummy authentication handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (showLogin) {
      loginMutation(authForm); // login status handled in onSuccess
    } else if (showSignup) {
      authService.register(authForm)
        .then(() => {
          setShowSignup(false);
          alert("Signup successful! Please login.");
        })
        .catch((err) => {
          console.error("Signup error:", err.message);
          alert("Signup failed.");
        });
    }
  };

  // Handle input changes for auth forms
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for post form
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({ ...prev, [name]: value }));
  };

  // Create or update post
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing post
      setPosts(posts.map(post =>
        post.id === currentPost.id ? { ...post, ...postForm } : post
      ));
    } else {
      // Create new post
      const newPost = {
        id: posts.length + 1,
        ...postForm,
        author: 'Current User',
        date: new Date().toISOString().split('T')[0]
      };
      setPosts([newPost, ...posts]);
    }
    setCurrentPost(null);
    setIsEditing(false);
    setPostForm({ title: '', content: '', category: '' });
  };

  // Edit post
  const handleEdit = (post) => {
    setCurrentPost(post);
    setIsEditing(true);
    setPostForm({
      title: post.title,
      content: post.content,
      category: post.category
    });
  };

  // Delete post
  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  // Filter posts by search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MERN Blog</h1>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsEditing(false) & setCurrentPost(null) & setPostForm({ title: '', content: '', category: '' })}
                  className="flex items-center bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
                >
                  <FaPlus className="mr-2" /> New Post
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true) & setShowSignup(false)}
                  className="flex items-center px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </button>
                <button
                  onClick={() => setShowSignup(true) & setShowLogin(false)}
                  className="flex items-center px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  <FaUserPlus className="mr-2" /> Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Auth Modals */}
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

              {/* Show error message if login failed */}
              {loginMutation.isError && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                  {
                    loginMutation.error?.response?.data?.message || // server error message
                    loginMutation.error?.message || // network error message from Axios
                    "Login failed. Please try again." // final fallback
                  }
                </div>
              )}

              <form onSubmit={handleAuthSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={authForm.username}
                      onChange={handleAuthChange}
                      className="w-full pl-10 p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={authForm.password}
                      onChange={handleAuthChange}
                      className="w-full pl-10 p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loginMutation.isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    {loginMutation.isLoading ? (
                      <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                    ) : (
                      <FaSignInAlt className="mr-2" />
                    )}
                    {loginMutation.isLoading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {showSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
              <form onSubmit={handleAuthSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={authForm.username}
                      onChange={handleAuthChange}
                      className="w-full pl-10 p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={authForm.password}
                      onChange={handleAuthChange}
                      className="w-full pl-10 p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <FaUserPlus className="mr-2" /> Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Form */}
        {(isEditing || currentPost === null) && isLoggedIn && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={handlePostSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handlePostChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={postForm.content}
                  onChange={handlePostChange}
                  className="w-full p-2 border rounded h-32"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={postForm.category}
                  onChange={handlePostChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false) & setCurrentPost(null) & setPostForm({ title: '', content: '', category: '' })}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border rounded"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {post.category}
                  </span>
                  {isLoggedIn && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found. {isLoggedIn && 'Create a new post to get started!'}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>© 2023 MERN Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
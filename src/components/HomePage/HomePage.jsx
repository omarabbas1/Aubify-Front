// HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const navigate = useNavigate();
  const { username, setUsername } = useUser();

  useEffect(() => {
    // Attempt to retrieve the username from localStorage upon component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post('http://localhost:8080/posts', { content: newPostContent });
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      await axios.post(`http://localhost:8080/posts/${postId}/comments`, { content: comment });
      fetchPosts(); // Refresh the list of posts to include the new comment
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('username'); // Clear username from localStorage on sign out
    navigate('/');
  };

  return (
    <div className="home-page">
      {/* Navbar and other components remain unchanged */}
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/aubify-logo.jpg" alt="Logo" className="navbar-logo" /> 
          <span className="website-name">Aubify</span> 
        </div>
        <div className="navbar-center">
          <input type="text" placeholder="Search..." /> {/* Search bar */}
        </div>
        <div className="navbar-right">
          <span className="user-name">Welcome, {username}!</span> 
          <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button> {/* Sign out button */}
        </div>
      </nav>
      <div className='post-container'>
        <h1>Add a Post:</h1>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button onClick={handleCreatePost}>Post</button>

        <div className="post-list">
          <h2>Posts:</h2>
          {posts.map((post) => (
            <div key={post._id} className="post">
              <p>{post.content}</p>
              <div className="comment-container">
                <h3>Comments:</h3>
                {post.comments.map((comment, index) => (
                  <p key={index}>{comment.content}</p>
                ))}
                <CommentInput postId={post._id} handleAddComment={handleAddComment} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentInput = ({ postId, handleAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    handleAddComment(postId, comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmitComment} className="comment-form">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
      />
      <button type="submit">Comment</button>
    </form>
  );
};

export default HomePage;
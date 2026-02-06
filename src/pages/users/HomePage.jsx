import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
e.preventDefault();
    dispatch(logout());
    navigate("/login");
  
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>Welcome to YT Clone</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Discover, watch, and share amazing content
      </p>

      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Start Exploring
      </button>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '15px',
          marginLeft: '10px',
        }}
      >
        Logout
      </button>
    </div>
  );
}

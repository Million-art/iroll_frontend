import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiBaseUrl } from '../constant';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
     e.preventDefault();

    try {
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }

      setLoading(true);
      setError('');
      setSuccessMessage('');

      const response = await axios.post(
        `${apiBaseUrl}/remotemployee/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );

      const { user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));

      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      setSuccessMessage('Login successful!');
    } catch (error) {
      setError('Error during login. Please try again.');
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-black p-8 shadow-md rounded-md w-96">
        <h1 className="text-white text-2xl text-center mb-5">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold mb-2">username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="text-red-500 mb-2">{error}</div>
          <div className="text-green-500 mb-2">{successMessage}</div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

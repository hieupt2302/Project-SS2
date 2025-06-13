import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? 'register' : 'login';
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const res = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        payload,
        { withCredentials: true }
      );

      console.log(`${isSignup ? 'Signup' : 'Login'} success:`, res.data);
      window.location.href = '/home';
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className=' bg-white flex flex-col items-center pt-5 rounded-2xl'>
      <h1 className="text-2xl font-bold mb-6">{isSignup ? 'Sign Up' : 'Sign In'}</h1>

      <a
        href="http://localhost:5000/auth/google"
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 mb-4"
      >
        {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
      </a>

      <form onSubmit={handleSubmit} className=" shadow-md rounded px-8 pt-6 pb-8 w-96">
        {isSignup && (
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />
        )}
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded mb-3"
          required
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded mb-3"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isSignup ? 'Register' : 'Login'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
        <button onClick={toggleMode} className="text-blue-500 hover:underline">
          {isSignup ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;

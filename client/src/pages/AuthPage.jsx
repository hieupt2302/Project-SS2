// pages/AuthPage.jsx
import React from 'react';

const AuthPage = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <a
        href="http://localhost:5000/auth/google"
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 mb-4"
      >
        Sign in with Google
      </a>
      <form method="POST" action="/auth/login" className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h2 className="text-lg font-semibold mb-4">Sign in with Email</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded mb-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded mb-3"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default AuthPage;

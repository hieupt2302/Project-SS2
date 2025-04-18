import React from 'react';
import axios from 'axios';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        {/* Form login */}
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Sign In
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or Sign In With</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Sign In/Sign Up by Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      window.location.href = '/home';
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
      {/* Ảnh nền mờ */}
      <img
        src="https://media.istockphoto.com/id/1829241109/photo/enjoying-a-brunch-together.jpg?s=612x612&w=0&k=20&c=9awLLRMBLeiYsrXrkgzkoscVU_3RoVwl_HA-OT-srjQ="
        alt="Food background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* Card login */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-10 py-10 flex flex-col items-center">
          <img
            src="/recipe-master-logo.png"
            alt="Logo"
            className="w-20 h-20 mb-4 rounded-full shadow-lg border-4 border-orange-100 bg-white"
          />
          <h1 className="text-3xl font-extrabold text-orange-600 mb-5 tracking-wide drop-shadow">Sign In</h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={20} />
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-orange-200 rounded-xl pl-12 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white/80 text-gray-700 font-medium"
              />
            </div>
            <div className="mb-6 relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-orange-200 rounded-xl pl-12 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white/80 text-gray-700 font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition shadow-lg text-lg tracking-wide mb-4"
            >
              LOGIN
            </button>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          </form>
          <div className="flex items-center w-full my-4">
            <div className="flex-grow h-px bg-orange-100"></div>
            <span className="mx-3 text-orange-300 text-sm">or</span>
            <div className="flex-grow h-px bg-orange-100"></div>
          </div>
          <a
            href="http://localhost:5000/auth/google"
            className="flex items-center justify-center gap-3 w-full bg-white border border-orange-200 text-orange-600 font-semibold py-3 rounded-xl shadow hover:bg-orange-50 transition text-lg"
          >
            <FaGoogle className="text-orange-500 text-2xl" />
            Login with Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
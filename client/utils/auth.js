// utils/auth.js
import axios from 'axios';

export const checkUser = async () => {
  try {
    const res = await fetch('http://localhost:5000/auth/me', {
      credentials: 'include' // ⬅ VERY IMPORTANT
    });

    if (!res.ok) return null;
    const user = await res.json();
    return user;
  } catch (err) {
    console.error('Auth check failed:', err);
    return null;
  }
};

export const checkUserSession = async (navigate) => {
  try {
    const res = await axios.get('http://localhost:5000/auth/me', {
      withCredentials: true,
    });
    return res.data.user || res.data;
  } catch (err) {
    console.warn('Unauthorized, redirecting to login...');
    navigate('/auth');
    return null;
  }
};


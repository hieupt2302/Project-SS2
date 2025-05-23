// utils/auth.js
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


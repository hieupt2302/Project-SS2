import { useEffect, useState } from 'react';
export default function SettingsPage() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('http://localhost:5000/auth/me', {
          credentials: 'include', // Đảm bảo gửi session cookie
        })
          .then(res => res.json())
          .then(data => setUser(data))
          .catch(() => setUser(null));
    }, []);
    if (!user) return <div>Loading...</div>;
    return(
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
    )
}
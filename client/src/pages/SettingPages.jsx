import { useEffect, useState } from 'react';
export default function SettingsPage() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      fetch('http://localhost:5000/api/me', { credentials: 'include' })
          .then(res => res.json())
          .then(data => console.log('User:', data))
          .catch(err => console.error('Not logged in:', err));
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
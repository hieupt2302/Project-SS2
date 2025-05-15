import React, { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Lấy token từ localStorage (hoặc context nếu bạn dùng)
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to fetch notifications', err));
  }, []);

  const handleDelete = (id) => {
    // Gọi API xóa (nếu có), hiện tại chỉ xóa local
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-md" />
              <div>
                <p className="font-medium text-gray-800">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(notification.id)}
              className="text-gray-500 hover:text-red-500 text-xl"
              aria-label="Delete notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

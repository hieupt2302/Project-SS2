import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { checkUserSession } from '../../utils/auth';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const load = async () => {
      const user = await checkUserSession();
      if (user) setCurrentUser(user);

      const res = await axios.get('http://localhost:5000/api/notifications/my-notifications', {
        withCredentials: true,
      });
      setNotifications(res.data);
    };
    load();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        withCredentials: true,
      });
      setNotifications((prev) =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };


  const handleProfileClick = () => {
    if (!currentUser) return;
    navigate(currentUser.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      setCurrentUser(null);
      navigate('/auth');
    } catch (err) {
      alert('Logout failed');
    }
  };

  const profileImage = currentUser?.imageUrl
    ? currentUser.imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-yellow-100 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate('/home')}
      >
        <img
          src="/recipe-master-logo.png"
          alt="Recipe Master Logo"
          className="w-10 h-10 mr-2"
        />
        <span className="font-bold text-xl text-yellow-800">Recipe Master</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Create Button */}
        {currentUser && (
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
          >
            <PlusCircle className="w-5 h-5" />
            <span className=' max-sm:hidden'>Create</span>
          </button>
        )}

        {/*  */}
        {currentUser && (
          <button
            onClick={() => navigate('/meal-planning')}
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
          >
            <CalendarDays className="w-5 h-5" />
            <span className='max-sm:hidden'>Meal Planning</span>
          </button>
        )}

        {/* Notification Bell */}
        {currentUser && (
          <div className="relative">
            <button onClick={() => setShowDropdown(prev => !prev)} className="relative">
              <Bell className="w-6 h-6 text-yellow-800" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-2 z-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`p-2 rounded-md cursor-pointer mb-1 ${
                        notif.isRead ? 'text-gray-500' : 'font-semibold text-black'
                      } hover:bg-yellow-50`}
                    >
                      <p className="text-sm">
                        {notif.fromUser?.name || 'Someone'}: {notif.message}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-yellow-800 hover:text-yellow-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="max-sm:hidden">Logout</span>
          </button>
        )}

        {/* Profile Image */}
        {currentUser && (
          <img
            src={profileImage}
            alt="Profile"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 cursor-pointer hover:scale-105 transition"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut } from 'lucide-react';
import axios from 'axios';
import { checkUserSession } from '../../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = await checkUserSession(); // Don't redirect here
      if (user) setCurrentUser(user);
    };
    load();
  }, []);

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
            Create
          </button>
        )}

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-yellow-800 hover:text-yellow-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
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

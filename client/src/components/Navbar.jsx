import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, PlusCircle } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     // Fetch current user
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/auth/google/callback', {
//           withCredentials: true,
//         });
//         setCurrentUser(res.data.user || res.data); // Adjust as needed
//       } catch (err) {
//         console.log("User not authenticated");
//       }
//     };
//     fetchUser();
//   }, []);

  const handleProfileClick = () => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
        navigate('/admin-dashboard');
    } else {
        navigate('/user-dashboard');
    }
  };

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
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
        >
          <PlusCircle className="w-5 h-5" />
          Create
        </button>

        {/* Profile Icon */}
        <button
          onClick={handleProfileClick}
          className="bg-white border border-yellow-400 rounded-full p-2 hover:bg-yellow-200 transition"
        >
          <User className="w-5 h-5 text-yellow-700" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

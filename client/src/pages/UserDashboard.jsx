import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUser } from '../../utils/auth';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await checkUser();
      if (!data) return navigate('/auth');
      setUser(data);
    };
    load();
  }, []);

  if (!user) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">👋 Welcome Back</h1>

        <div className="space-y-4 text-center">
          <div>
            <span className="text-sm font-medium text-gray-500">Name</span>
            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Email</span>
            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 mr-2">Role:</span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {user.role}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Joined</span>
            <p className="text-md text-gray-600">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

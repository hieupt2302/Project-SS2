import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { checkUserSession } from '../../utils/auth';

const AdminViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUserSession(data);
    };
    load();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
      const recipeRes = await axios.get(`http://localhost:5000/api/recipes/user/${id}`, { withCredentials: true });
      setUser(userRes.data);
      setRecipes(recipeRes.data);
    };
    fetchData();
  }, [id]);

  if (!userSession || !user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 {user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleString()}</p>

      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-4">📋 Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(r => (
          <div key={r.id} className="bg-white p-4 shadow rounded">
            <img src={`http://localhost:5000${r.imageUrl}`} alt={r.title} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="text-lg font-bold">{r.title}</h3>
            <p className="text-sm text-gray-600">{r.ingredients}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminViewUser;

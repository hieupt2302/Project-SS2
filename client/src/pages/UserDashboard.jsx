import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUser, checkUserSession } from '../../utils/auth';
import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';
import EditRecipeModal from '../components/EditRecipeModal';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);

   useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUserSession(data);
    };
    load();
  }, []);

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, { withCredentials: true });
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // for edit save
  const handleSave = (id, updated) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  useEffect(() => {
    const load = async () => {
      const data = await checkUser();
      if (!data) return navigate('/auth');
      setUser(data);

      const res = await axios.get('http://localhost:5000/api/recipes/mine', {
        withCredentials: true,
      });
      setRecipes(res.data);
    };
    load();
  }, []);

  if (!userSession || !user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mb-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">👋 Welcome, {user.name}</h1>
        <p className="text-center text-sm text-gray-500 mb-2">Email: {user.email}</p>
        <p className="text-center text-sm text-gray-500 mb-2">
          Role: <span className={`px-2 py-1 rounded ${user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.role}</span>
        </p>
      </div>

      {/* User Recipes */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">📋 Your Recipes</h2>
        {recipes.length === 0 ? (
          <p className="text-gray-500 text-center">You haven’t created any recipes yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map(recipe => (
              <li key={recipe.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                {recipe.imageUrl && (
                  <img
                    src={`http://localhost:5000${recipe.imageUrl}`}
                    alt={recipe.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="text-lg font-bold text-gray-800">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.ingredients}</p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-3">{recipe.instructions}</p>
                {/* Future: Add Edit/Delete buttons here */}
                <div className="flex justify-end mt-3">
                  <button
                    className="text-sm bg-blue-600 py-1 px-5 rounded-2xl hover:underline"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Pencil className='w-6 h-6 text-white'/>
                  </button>
                  <button
                    className="text-sm bg-red-600 py-1 px-5 rounded-2xl hover:underline"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash className='w-6 h-6 text-white'/>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Recipe Update Modal */}
        <EditRecipeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipe={editingRecipe}
          onSave={handleSave}
        />
    </div>
  );
};

export default UserDashboard;

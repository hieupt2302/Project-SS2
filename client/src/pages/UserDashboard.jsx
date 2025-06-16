import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUser, checkUserSession } from '../../utils/auth';
import axios from 'axios';
import { Heart, Pencil, Trash } from 'lucide-react';
import EditRecipeModal from '../components/EditRecipeModal';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  // change password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/auth/change-password',
        { password: newPassword },
        { withCredentials: true }
      );
      setPasswordSuccess('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordError('Failed to change password');
    }
  };

  useEffect(() => {
    const loadUserAndRecipes = async () => {
      const session = await checkUserSession(navigate);
      if (!session) return;
      setUserSession(session);

      const user = await checkUser();
      if (!user) return navigate('/auth');
      setUser(user);

      const favRes = await axios.get('http://localhost:5000/api/favorites/my-favorites', { withCredentials: true });
      const favorites = favRes.data;

      const recipesRes = await axios.get('http://localhost:5000/api/recipes/mine', { withCredentials: true });
      const recipesWithFav = recipesRes.data.map((r) => {
        const isFav = favorites.some((f) => f.recipeId == r.id && f.isDb);
        return { ...r, isFavorite: isFav };
      });
      setRecipes(recipesWithFav);

      const dbFavs = favorites.filter((f) => f.isDb);
      const apiFavs = favorites.filter((f) => !f.isDb);

      const dbDetails = await Promise.all(
        dbFavs.map((f) =>
          axios
            .get(`http://localhost:5000/api/recipes/${f.recipeId}`, { withCredentials: true })
            .then((res) => ({ ...res.data, isDb: true }))
        )
      );

      const apiDetails = await Promise.all(
        apiFavs.map((f) =>
          axios
            .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${f.recipeId}`)
            .then((res) => (res.data.meals?.[0] ? { ...res.data.meals[0], isDb: false } : null))
        )
      );

      const allFavorites = [...dbDetails, ...apiDetails].filter(Boolean);
      setFavoriteRecipes(allFavorites);
    };

    loadUserAndRecipes();
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

  const handleSave = (id, updated) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const toggleFavorite = async (recipeId, isDb) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/favorites/toggle',
        { recipeId, isDb },
        { withCredentials: true }
      );

      const isNowFav = res.data.status === 'added';

      if (isDb) {
        setRecipes((prev) =>
          prev.map((r) => (r.id === recipeId ? { ...r, isFavorite: isNowFav } : r))
        );
      }

      const favRes = await axios.get('http://localhost:5000/api/favorites/my-favorites', {
        withCredentials: true,
      });

      const dbFavs = favRes.data.filter((f) => f.isDb);
      const apiFavs = favRes.data.filter((f) => !f.isDb);

      const dbDetails = await Promise.all(
        dbFavs.map((f) =>
          axios
            .get(`http://localhost:5000/api/recipes/${f.recipeId}`, { withCredentials: true })
            .then((res) => ({ ...res.data, isDb: true }))
        )
      );

      const apiDetails = await Promise.all(
        apiFavs.map((f) =>
          axios
            .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${f.recipeId}`)
            .then((res) => (res.data.meals?.[0] ? { ...res.data.meals[0], isDb: false } : null))
        )
      );

      const allFavorites = [...dbDetails, ...apiDetails].filter(Boolean);
      setFavoriteRecipes(allFavorites);
    } catch (err) {
      console.error('Toggle favorite failed:', err);
    }
  };

  if (!userSession || !user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto mb-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">👋 Welcome, {user.name}</h1>
        <p className="text-center text-sm text-gray-500 mb-2">Email: {user.email}</p>
        <p className="text-center text-sm text-gray-500 mb-2">
          Role:{' '}
          <span
            className={`px-2 py-1 rounded ${
              user.role === 'admin'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {user.role}
          </span>
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowPasswordModal(true)}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Favorite Recipes */}
      <div className="max-w-3xl mx-auto mt-10 mb-10">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteRecipes.map((recipe) => {
            const isDb = recipe.isDb;
            const id = isDb ? recipe.id : recipe.idMeal;
            const image = isDb
              ? `http://localhost:5000${recipe.imageUrl}`
              : recipe.strMealThumb;
            const title = isDb ? recipe.title : recipe.strMeal;
            const ingredients = isDb ? recipe.ingredients : recipe.strCategory;
            const instructions = isDb ? recipe.instructions : recipe.strInstructions;

            return (
              <li key={id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                  <button
                    onClick={() => toggleFavorite(id, isDb)}
                    className="transition text-red-500"
                  >
                    <Heart className="w-6 h-6" fill="red" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ingredients}</p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                  {instructions?.slice(0, 100)}...
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Recipes */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">📋 Your Recipes</h2>
        {recipes.length === 0 ? (
          <p className="text-gray-500 text-center">You haven’t created any recipes yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                {recipe.imageUrl && (
                  <img
                    src={`http://localhost:5000${recipe.imageUrl}`}
                    alt={recipe.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{recipe.title}</h3>
                  <button
                    onClick={() => toggleFavorite(recipe.id, true)}
                    className={`transition ${recipe.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className="w-6 h-6" strokeWidth={2} fill={recipe.isFavorite ? 'red' : 'none'} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.ingredients}</p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-3">{recipe.instructions}</p>
                <div className="flex justify-end mt-3 gap-2">
                  <button
                    className="text-sm bg-blue-600 py-1 px-5 rounded-2xl hover:underline"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Pencil className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="text-sm bg-red-600 py-1 px-5 rounded-2xl hover:underline"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash className="w-6 h-6 text-white" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <EditRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={editingRecipe}
        onSave={handleSave}
      />
    {/* password update */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-500 text-sm mb-2">{passwordSuccess}</div>}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

  );
};

export default UserDashboard;

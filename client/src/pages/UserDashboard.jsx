import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUser, checkUserSession } from '../../utils/auth';
import axios from 'axios';
import { Clock, Heart, Pencil, Trash } from 'lucide-react';
import EditRecipeModal from '../components/EditRecipeModal';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [viewedHistory, setViewedHistory] = useState([]);
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
      try {
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
      } catch (error) {
        console.log(error)
      }
    };

    loadUserAndRecipes();
  }, []);

  useEffect(() => {
    // history watch
    const loadUserAndRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/history/viewed', { withCredentials: true });
        setViewedHistory(res.data);
      }
      catch (error) {
        setViewedHistory([])
      }
    }
    loadUserAndRecipes();
  }, [])

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

  if (!userSession || !user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400 border-solid"></div>
      <span className="ml-4 text-lg text-orange-500 font-semibold">Loading...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-50 to-yellow-100 p-6">
      <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-3xl mx-auto mb-10 border border-orange-100">
        <h1 className="text-3xl font-extrabold text-center text-orange-700 mb-4 tracking-tight drop-shadow">👋 Welcome, {user.name}</h1>
        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-gray-600 text-base">Email: <span className="font-semibold">{user.email}</span></p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${
              user.role === 'admin'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {user.role}
          </span>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-orange-500 hover:to-orange-700 transition"
            onClick={() => setShowPasswordModal(true)}
          >
            Change password
          </button>
        </div>
      </div>

      {/* Favorite Recipes */}
      <div className="max-w-3xl mx-auto mt-10 mb-10">
        <h2 className="text-xl font-bold mb-4 text-orange-700 flex items-center gap-2">
          <Heart className="w-5 h-5 text-orange-500" fill="orange" /> Favorite Recipes
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-7">
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
              <li key={id} className="bg-white/90 p-4 rounded-2xl shadow-lg hover:shadow-xl transition border border-orange-100">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover rounded-xl mb-3 shadow"
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                  <button
                    onClick={() => toggleFavorite(id, isDb)}
                    className="transition text-orange-500 hover:scale-110"
                  >
                    <Heart className="w-6 h-6" fill="orange" />
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
        <h2 className="text-xl font-bold mb-4 text-orange-700 flex items-center gap-2">📋 Your Recipes</h2>
        {recipes.length === 0 ? (
          <p className="text-gray-500 text-center">You haven't created any recipes yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="bg-white/90 p-4 rounded-2xl shadow-lg hover:shadow-xl transition border border-orange-100"
              >
                {recipe.imageUrl && (
                  <img
                    src={`http://localhost:5000${recipe.imageUrl}`}
                    alt={recipe.title}
                    className="w-full h-40 object-cover rounded-xl mb-3 shadow"
                  />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{recipe.title}</h3>
                  <button
                    onClick={() => toggleFavorite(recipe.id, true)}
                    className={`transition ${recipe.isFavorite ? 'text-orange-500 scale-110' : 'text-gray-400 hover:text-orange-500 hover:scale-110'}`}
                  >
                    <Heart className="w-6 h-6" strokeWidth={2} fill={recipe.isFavorite ? 'orange' : 'none'} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.ingredients}</p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-3">{recipe.instructions}</p>
                <div className="flex justify-end mt-3 gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow transition"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow transition"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* History Viewed */}
      <div className="max-w-3xl mx-auto mt-10 mb-10">
        <h2 className="text-xl font-bold mb-4 text-orange-700 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" /> Viewed History
        </h2>
        {viewedHistory.length === 0 ? (
          <p className="text-gray-500 text-center">You haven't viewed any recipes recently.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {viewedHistory.map((item) => (
              <li key={item.id} className="bg-white/90 p-4 rounded-2xl shadow-lg hover:shadow-xl transition border border-orange-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800">
                    {item.recipeTitle || `Recipe #${item.recipeId}`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.viewedAt).toLocaleString()}
                  </span>
                </div>
                <a
                  href={item.isDb ? `/recipes/db/${item.recipeId}` : `/recipes/${item.recipeId}`}
                  className="text-orange-600 hover:underline text-sm font-semibold"
                >
                  View recipe again
                </a>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-orange-100">
            <h2 className="text-xl font-bold mb-4 text-orange-700">Change password</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                className="w-full border border-orange-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-orange-200 outline-none"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full border border-orange-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-orange-200 outline-none"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-500 text-sm mb-2">{passwordSuccess}</div>}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow hover:from-orange-500 hover:to-orange-700 transition"
                >
                  Save
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
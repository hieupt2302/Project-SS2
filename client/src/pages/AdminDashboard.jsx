import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditRecipeModal from '../components/EditRecipeModal';
import { checkUserSession } from '../../utils/auth';
import { Heart } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // 🔥 store logged-in user
  const [editingUser, setEditingUser] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({ title: '', ingredients: '', instructions: '' });
  const [user, setUser] = useState(null);  // check user
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  // check current user session
  useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUser(data);
    };
    load();
  }, []);
  
  const openRecipeModal = (recipe) => {
    setEditingRecipe(recipe);
    setRecipeForm({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
  };

  useEffect(() => {
    const loadData = async () => {
      const [recipesRes, favRes] = await Promise.all([
        axios.get('http://localhost:5000/api/recipes/all', { withCredentials: true }),
        axios.get('http://localhost:5000/api/favorites/my-favorites', { withCredentials: true }),
      ]);

      const favorites = favRes.data;

      const recipesWithFav = recipesRes.data.map((r) => ({
        ...r,
        isFavorite: favorites.some((f) => f.recipeId == r.id && f.isDb),
      }));

      setAllRecipes(recipesWithFav);

      const dbFavs = favorites.filter(f => f.isDb);
      const apiFavs = favorites.filter(f => !f.isDb);

      const dbDetails = await Promise.all(
        dbFavs.map(f =>
          axios.get(`http://localhost:5000/api/recipes/${f.recipeId}`, { withCredentials: true })
            .then(res => ({ ...res.data, isDb: true }))
        )
      );

      const apiDetails = await Promise.all(
        apiFavs.map(f =>
          axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${f.recipeId}`)
            .then(res => res.data.meals?.[0] ? { ...res.data.meals[0], isDb: false } : null)
        )
      );

      const allFavorites = [...dbDetails, ...apiDetails].filter(Boolean);
      setFavoriteRecipes(allFavorites);
    };

    if (currentUser?.role === 'admin') {
      loadData();
    }
  }, [currentUser]);


  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/me', {
        withCredentials: true,
      });
      setCurrentUser(res.data.user || res.data);
    } catch (err) {
      console.error('User not logged in');
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, form);
    setEditingUser(null);
    fetchUsers();
  };

  // EDIT & DELETE
  const handleRecipeDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
        withCredentials: true,
      });
      setAllRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleRecipeUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/recipes/${editingRecipe.id}`,
        recipeForm,
        { withCredentials: true }
      );
      setAllRecipes(prev =>
        prev.map(r => r.id === editingRecipe.id ? { ...r, ...recipeForm } : r)
      );
      setEditingRecipe(null);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  // FAVOURITE RECIPE
  const toggleFavorite = async (recipeId, isDb) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/favorites/toggle',
        { recipeId, isDb },
        { withCredentials: true }
      );

      const isNowFav = res.data.status === 'added';

      if (isDb) {
        setAllRecipes(prev =>
          prev.map(r =>
            r.id === recipeId ? { ...r, isFavorite: isNowFav } : r
          )
        );
      }

      const favRes = await axios.get('http://localhost:5000/api/favorites/my-favorites', {
        withCredentials: true,
      });

      const dbFavs = favRes.data.filter(f => f.isDb);
      const apiFavs = favRes.data.filter(f => !f.isDb);

      const dbDetails = await Promise.all(
        dbFavs.map(f =>
          axios.get(`http://localhost:5000/api/recipes/${f.recipeId}`, { withCredentials: true })
            .then(res => ({ ...res.data, isDb: true }))
        )
      );

      const apiDetails = await Promise.all(
        apiFavs.map(f =>
          axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${f.recipeId}`)
            .then(res => res.data.meals?.[0] ? { ...res.data.meals[0], isDb: false } : null)
        )
      );

      const allFavorites = [...dbDetails, ...apiDetails].filter(Boolean);
      setFavoriteRecipes(allFavorites);

    } catch (err) {
      console.error('Toggle favorite failed:', err);
    }
  };


  console.log(currentUser?.role)
  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      {/* 🧑‍💼 Display all admins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {users.filter(u => u.role === 'admin').map(admin => (
          <div key={admin.id} className="bg-white shadow p-4 rounded-md flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Admin avatar"
              className="w-20 h-20 rounded-full border"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">ADMIN</h2>
              <input
                className="border rounded px-3 py-2 w-full mb-2 mt-1"
                defaultValue={admin.name}
                readOnly
              />
              <input
                type="password"
                className="border rounded px-3 py-2 w-full"
                defaultValue="********"
                readOnly
              />
            </div>
          </div>
        ))}
      </div>


      {/* Table UI remains the same */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-yellow-200 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => openEditModal(u)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >📝</button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal stays the same */}
      {editingUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <input
              type="text"
              className="border w-full p-2 mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              className="border w-full p-2 mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />
            <select
              className="border w-full p-2 mb-4"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditingUser(null)}
              >Cancel</button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleUpdate}
              >Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Fav recipes */}
      <h2 className="text-xl font-semibold mb-4 text-yellow-800 mt-10">❤️ My Favorite Recipes</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {favoriteRecipes.map(recipe => {
            const isDb = recipe.isDb;
            const id = isDb ? recipe.id : recipe.idMeal;
            const image = isDb ? `http://localhost:5000${recipe.imageUrl}` : recipe.strMealThumb;
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
                    className={`transition text-red-500`}
                  >
                    <Heart className="w-6 h-6" fill="red" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ingredients}</p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-3">{instructions?.slice(0, 100)}...</p>
              </li>
            );
          })}
        </ul>

      {/* all recipe */}
      <h2 className="text-xl font-semibold mb-4 mt-10 text-yellow-800">📚 All Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-4 rounded shadow-md">
              <img
                src={`http://localhost:5000${recipe.imageUrl}`}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{recipe.title}</h3>
                <button
                  onClick={() => toggleFavorite(recipe.id, true)}
                  className={`transition ${recipe.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className="w-6 h-6" fill={recipe.isFavorite ? 'red' : 'none'} />
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{recipe.ingredients}</p>
              <p className="text-sm mt-2">
                By: {recipe.User ? (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/admin/view-user/${recipe.User.id}`)}
                  >
                    {recipe.User.name}
                  </button>
                ) : (
                  <span className="text-gray-400">Unknown</span>
                )}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => openRecipeModal(recipe)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >📝</button>

                <button
                  onClick={() => handleRecipeDelete(recipe.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* EDITING MODAL */}
        <EditRecipeModal
          isOpen={!!editingRecipe}
          onClose={() => setEditingRecipe(null)}
          recipe={editingRecipe}
          onSave={(id, updated) => {
            setAllRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r)); // for AdminDashboard
          }}
        />
    </div>
  );
};

export default AdminDashboard;



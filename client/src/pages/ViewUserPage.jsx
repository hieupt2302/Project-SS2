import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewUserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', ingredients: '', instructions: '' });

  const handleDelete = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
        await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`, {
        withCredentials: true,
        });
        setRecipes(prev => prev.filter(r => r.id !== recipeId));
    } catch (err) {
        alert('Delete failed: ' + err.message);
    }
    };

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setEditForm({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
    });
  };

  const handleEditSave = async () => {
    try {
        await axios.put(`http://localhost:5000/api/recipes/${editingRecipe.id}`, editForm, {
        withCredentials: true,
        });

        setRecipes(prev =>
        prev.map(r =>
            r.id === editingRecipe.id ? { ...r, ...editForm } : r
        )
        );

        setEditingRecipe(null);
    } catch (err) {
        alert('Update failed: ' + err.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, recipeRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/recipes/user/${id}`, { withCredentials: true })
        ]);
        setUser(userRes.data);
        setRecipes(recipeRes.data);
      } catch (err) {
        alert('Failed to fetch user or recipes');
      }
    };

    fetchData();
  }, [id]);

  if (!user) return <div className="text-center p-10">Loading user data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-yellow-800 mb-2">👤 {user.name}</h1>
      <p className="text-sm text-gray-500 mb-4">Email: {user.email}</p>
      <p className="text-sm text-gray-500 mb-4">Role: {user.role}</p>

      <h2 className="text-xl font-semibold mt-6 mb-3 text-yellow-700">📋 Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-500">This user hasn't created any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-4 rounded shadow">
              <img
                src={`http://localhost:5000${recipe.imageUrl}`}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{recipe.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{recipe.ingredients}</p>
              <div className="flex justify-end mt-3">
                <button
                onClick={() => openEditModal(recipe)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                📝 Edit
                </button>
                <button
                onClick={() => handleDelete(recipe.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                🗑️ Delete
                </button>
               </div>
            </div>
          ))}
        </div>
      )}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Recipe</h2>

            <input
                type="text"
                className="w-full border p-2 mb-2"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
            />
            <textarea
                className="w-full border p-2 mb-2"
                rows="3"
                value={editForm.ingredients}
                onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                placeholder="Ingredients"
            />
            <textarea
                className="w-full border p-2 mb-4"
                rows="4"
                value={editForm.instructions}
                onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                placeholder="Instructions"
            />

            <div className="flex justify-end gap-2">
                <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditingRecipe(null)}
                >
                Cancel
                </button>
                <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={handleEditSave}
                >
                Save
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default ViewUserPage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // 🔥 store logged-in user
  const [editingUser, setEditingUser] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      axios.get('http://localhost:5000/api/recipes/all', { withCredentials: true })
        .then(res => setAllRecipes(res.data));
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

  console.log(currentUser?.role)

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
              <button className="mt-2 px-4 py-1 bg-yellow-200 border rounded shadow hover:bg-yellow-300">
                Save
              </button>
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
              <h3 className="text-lg font-bold">{recipe.title}</h3>
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
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">📝</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️</button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default AdminDashboard;



import { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkUserSession } from '../../utils/auth';

const CreateRecipe = () => {
  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUser(data);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('ingredients', form.ingredients);
    formData.append('instructions', form.instructions);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setSuccessMsg('Recipe created successfully!');
      setForm({ title: '', ingredients: '', instructions: '' });
      setImage(null);
      setPreview(null);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-800">Create New Recipe</h1>

      {successMsg && (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded p-3 mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        {/* Ingredients */}
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          rows="4"
          placeholder="Ingredients (comma-separated or paragraph)"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        {/* Instructions */}
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          rows="6"
          placeholder="Instructions..."
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        {/* Image upload */}
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer inline-flex items-center bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-xl border border-yellow-300 shadow">
            <ImagePlus className="mr-2" size={18} />
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow font-semibold"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          {loading ? 'Uploading...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;

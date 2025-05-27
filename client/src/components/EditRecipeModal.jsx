import { useEffect, useState } from "react";
import axios from 'axios';

const EditRecipeModal = ({ isOpen, onClose, recipe, onSave }) => {
  const [form, setForm] = useState(recipe || { title: '', ingredients: '', instructions: '' });
  
  // Edit image upload
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    if (recipe) setForm(recipe);
  }, [recipe]);

  useEffect(() => {
    if (recipe) {
        setForm(recipe);
        setPreview(`http://localhost:5000${recipe.imageUrl || ''}`);
    }
  }, [recipe]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('ingredients', form.ingredients);
    formData.append('instructions', form.instructions);
    if (image) formData.append('image', image);

    try {
        const res = await axios.put(
        `http://localhost:5000/api/recipes/${recipe.id}`,
        formData,
        {
            withCredentials: true,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        }
        );
        onSave(recipe.id, res.data.recipe); // return updated recipe from server
        onClose();
    } catch (err) {
        alert('Update failed: ' + err.message);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Edit Recipe</h2>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Title"
        />
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          rows="3"
          placeholder="Ingredients"
        />
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          rows="4"
          placeholder="Instructions"
        />
        <div>
        <label className="text-sm font-medium text-gray-600 mb-1 block">Change Image</label>
        <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-xl border border-yellow-300 shadow inline-block">
            Upload New
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
            {preview && (
            <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-md border" />
            )}
        </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeModal;

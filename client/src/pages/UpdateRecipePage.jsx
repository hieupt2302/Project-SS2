import { useState, useEffect } from "react";

export default function UpdateRecipePage({ recipeId }) {
  const [recipe, setRecipe] = useState({ title: "", description: "", ingredients: "" });

  useEffect(() => {
    // Fetch current recipe data
    fetch(`/api/recipes/${recipeId}`)
      .then(res => res.json())
      .then(data => setRecipe(data));
  }, [recipeId]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Call API to update recipe
    console.log("Updating recipe:", recipe);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Recipe</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update
        </button>
      </form>
    </div>
  );
}

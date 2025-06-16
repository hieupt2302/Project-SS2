import { useState } from "react";

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState({ title: "", description: "", ingredients: "" });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, ingredients } = recipe;
    const createRecipe = async () => {
      try {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, ingredients }),
        });
        if (!response.ok) {
          throw new Error("Failed to create recipe");
        }
        const data = await response.json();
        console.log("Recipe created:", data);
      } catch (error) {
        console.error("Error creating recipe:", error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create
        </button>
      </form>
    </div>
  );
}

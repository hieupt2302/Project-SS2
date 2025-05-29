import { useEffect, useState } from "react";

export default function FavouriteRecipePage() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    // Fetch favourite recipes
    fetch("/api/recipes/favourites")
      .then(res => res.json())
      .then(data => setFavourites(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favourite Recipes</h1>
      <div className="space-y-4">
        {favourites.map(recipe => (
          <div key={recipe.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <p className="text-gray-600">{recipe.description}</p>
            <p className="text-sm mt-2 text-gray-500">Ingredients: {recipe.ingredients}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

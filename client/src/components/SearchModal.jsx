import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

const SearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [dbRecipes, setDbRecipes] = useState([]);
  const [apiRecipes, setApiRecipes] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRecipes = async () => {
      try {
        let allResults = [];

        // Fetch DB Recipes
        const dbRes = await axios.get('http://localhost:5000/api/recipes/public');
        setDbRecipes(
          dbRes.data.map((r) => ({
            id: r.id,
            title: r.title,
            image: `http://localhost:5000${r.imageUrl}`,
            category: r.User?.name || 'User',
            isDb: true,
          }))
        );

        // Fetch from external API
        if (query.trim()) {
          const res = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
          );
          if (res.data.meals) {
            const formatted = res.data.meals.map((meal) => ({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              isDb: false,
            }));
            setApiRecipes(formatted);
          } else {
            setApiRecipes([]);
          }
        } else {
          setApiRecipes([]);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    fetchRecipes();
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Recipe</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-sm">
            Close
          </button>
        </div>
        <input
          type="text"
          className="w-full mb-4 border p-2 rounded"
          placeholder="Search meal name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...dbRecipes, ...apiRecipes].map((recipe) => (
            <div
              key={`${recipe.isDb ? 'db' : 'api'}-${recipe.id}`}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => onSelect(recipe)}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
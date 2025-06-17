import { useEffect, useState } from 'react';
import SearchBar from '../components/Search';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';
import { useNavigate } from 'react-router-dom';
import { checkUserSession } from '../../utils/auth';

const Home = () => {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [dbRecipes, setDbRecipes] = useState([]);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUser(data);

      // Fetch DB recipes for everyone
      const dbRes = await axios.get('http://localhost:5000/api/recipes/public');
      setDbRecipes(dbRes.data);
    };
    load();
  }, []);

  const fetchRecipes = async () => {
    try {
      let allResults = [];

      // Fetch by name
      if (query) {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
        if (res.data.meals) allResults = res.data.meals;
      }

      // Fetch by each tag (ingredient)
      for (const tag of tags) {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${tag}`
        );
        if (res.data.meals) {
          for (const meal of res.data.meals) {
            if (!allResults.find((m) => m.idMeal === meal.idMeal)) {
              // fetch full meal details
              const detail = await axios.get(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              if (detail.data.meals) {
                allResults.push(detail.data.meals[0]);
              }
            }
          }
        }
      }

      // If no query or tags, load default
      if (!query && tags.length === 0) {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`
        );
        allResults = res.data.meals || [];
      }

      setRecipes(allResults);
    } catch (error) {
      console.error('Error fetching recipes', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [query, tags]);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400 border-solid"></div>
        <span className="ml-4 text-lg text-orange-500 font-semibold">Loading...</span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <HeroCarousel />
      <div className="flex flex-col items-center mt-6 mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-orange-700 tracking-tight drop-shadow">
          🍽️ Explore Delicious Recipes
        </h1>
        <p className="text-gray-500 text-lg mb-6 text-center max-w-2xl">
          Discover, search and filter thousands of recipes from around the world. Find your next favorite meal!
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar
            query={query}
            onQueryChange={(e) => setQuery(e.target.value)}
            tags={tags}
            setTags={setTags}
          />
        </div>
      </div>

      <hr className="my-8 border-orange-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dbRecipes.map((recipe) => (
          <RecipeCard
            key={`db-${recipe.id}`}
            recipe={{
              id: recipe.id,
              title: recipe.title,
              image: `http://localhost:5000${recipe.imageUrl}`,
              category: recipe.User?.name || 'Unknown',
              isDb: true,
            }}
            className="hover:scale-105 transition-transform duration-200"
          />
        ))}
        {recipes.map((recipe) => (
          <RecipeCard
            key={`api-${recipe.idMeal}`}
            recipe={{
              id: recipe.idMeal,
              title: recipe.strMeal,
              image: recipe.strMealThumb,
              category: recipe.strCategory,
              isDb: false,
            }}
            className="hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {(dbRecipes.length === 0 && recipes.length === 0) && (
        <div className="text-center text-gray-400 mt-16 text-lg">
          No recipes found. Try searching for something else!
        </div>
      )}
    </div>
  );
};

export default Home;
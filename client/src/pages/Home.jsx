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

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await checkUserSession(navigate);
      if (data) setUser(data);
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

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HeroCarousel />
      <h1 className="text-3xl font-bold mb-6 text-yellow-800">
        Explore Delicious Recipes
      </h1>

      <SearchBar
        query={query}
        onQueryChange={(e) => setQuery(e.target.value)}
        tags={tags}
        setTags={setTags}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};


export default Home;

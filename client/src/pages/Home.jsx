import { useEffect, useState } from 'react';
import SearchBar from '../components/Search';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`; // default
      const res = await axios.get(url);
      setRecipes(res.data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HeroCarousel />
      <h1 className="text-3xl font-bold mb-6 text-yellow-800">Explore Delicious Recipes</h1>
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Home;

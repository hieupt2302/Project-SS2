import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setRecipe(res.data.meals[0]);
      } catch (err) {
        console.error('Failed to fetch recipe details');
      }
    };
    fetchDetails();
  }, [id]);

  if (!recipe) return <div className="p-6 text-center">Loading...</div>;

  console.log(recipe)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-yellow-700 hover:text-yellow-900 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-yellow-800">{recipe.strMeal}</h1>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-64 object-cover rounded-md mb-6"
      />

      <p className="text-lg font-semibold mb-2">Category: <span className="text-gray-600">{recipe.strCategory}</span></p>
      <p className="text-lg font-semibold mb-4">Origin: <span className="text-gray-600">{recipe.strArea}</span></p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-yellow-800">Instructions</h2>
       <div className="flex flex-col items-center relative mt-6">
        {recipe.strInstructions
            .split('. ')
            .filter(step => step.trim() !== '')
            .map((step, index, arr) => (
            <div key={index} className="flex flex-col items-center">
                {/* Yellow dot + line */}
                <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {index < arr.length - 1 && (
                    <div className="w-1 h-6 bg-cyan-400"></div>
                )}
                </div>
                
                {/* Boxed instruction */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-md max-w-xl w-full text-center text-gray-700 font-medium">
                {step.trim() + '.'}
                </div>
            </div>
            ))}
        </div>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-yellow-800">Ingredients</h2>
        <div className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => {
            const ingredient = recipe[`strIngredient${i + 1}`];
            const measure = recipe[`strMeasure${i + 1}`];
            return ingredient && ingredient.trim() !== '' ? (
            <span
                key={i}
                className="inline-flex items-center px-3 py-1 bg-yellow-100 text-sm text-yellow-800 border border-yellow-300 rounded-full shadow-sm"
            >
                {ingredient} {measure && `– ${measure}`}
            </span>
            ) : null;
        })}
        </div>
    </div>
  );
};

export default RecipeDetail;

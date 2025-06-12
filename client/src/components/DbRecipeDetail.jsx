import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const DbRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Failed to fetch DB recipe details:', err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!recipe) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-yellow-700 hover:text-yellow-900 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-yellow-800">{recipe.title}</h1>
      {recipe.imageUrl && (
        <img
          src={`http://localhost:5000${recipe.imageUrl}`}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      <p className="text-lg font-semibold mb-2 text-gray-600">Created By: {recipe.User?.name || 'Unknown'}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3 text-yellow-800">Ingredients</h2>
      <p className="text-gray-700 whitespace-pre-line mb-6">{recipe.ingredients}</p>

      <h2 className="text-2xl font-semibold mb-3 text-yellow-800">Instructions</h2>
      <div className="flex flex-col items-center relative mt-6">
        {recipe.instructions
          .split('. ')
          .filter(step => step.trim() !== '')
          .map((step, index, arr) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {index < arr.length - 1 && (
                  <div className="w-1 h-6 bg-cyan-400"></div>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-md max-w-xl w-full text-center text-gray-700 font-medium">
                {step.trim() + '.'}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DbRecipeDetail;

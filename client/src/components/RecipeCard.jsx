import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.idMeal}`)}
      className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{recipe.strMeal}</h3>
        <p className="text-sm text-gray-500">{recipe.strCategory}</p>
      </div>
    </div>
  );
};

export default RecipeCard;


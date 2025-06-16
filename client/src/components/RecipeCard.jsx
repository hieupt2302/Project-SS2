import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(recipe.isDb ? `/recipes/db/${recipe.id}` : `/recipes/${recipe.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
        <p className="text-sm text-gray-500">{recipe.category}</p>
      </div>
    </div>
  );
};

export default RecipeCard;


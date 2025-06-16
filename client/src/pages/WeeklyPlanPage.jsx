import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import SearchModal from '../components/SearchModal';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const meals = ['Breakfast', 'Lunch', 'Dinner'];

const WeeklyPlanPage = () => {
  const [plan, setPlan] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch the weekly plan from the mealdb api and sql db
  const fetchPlan = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/weekly-plan/my-plan', {
        withCredentials: true,
      });

      const planItems = res.data;

      const hydratedPlan = await Promise.all(
        planItems.map(async (item) => {
          if (item.isDb) {
            const dbRes = await axios.get(
              `http://localhost:5000/api/recipes/${item.recipeId}`
            );
            return {
              ...item,
              title: dbRes.data.title,
              image: `http://localhost:5000${dbRes.data.imageUrl}`,
            };
          } else {
            const apiRes = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.recipeId}`
            );
            const meal = apiRes.data.meals?.[0];
            return {
              ...item,
              title: meal?.strMeal,
              image: meal?.strMealThumb,
            };
          }
        })
      );

      setPlan(hydratedPlan);
    } catch (err) {
      console.error('Error loading weekly plan:', err);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  // Add a recipe to a specific day + mealType
  const handleAdd = async ({ day, mealType, recipe }) => {
    try {
      await axios.post(
        'http://localhost:5000/api/weekly-plan/add',
        {
          day,
          mealType,
          recipeId: recipe.id,
          isDb: recipe.isDb,
        },
        { withCredentials: true }
      );
      fetchPlan();
    } catch (err) {
      console.error('Error adding recipe to plan:', err);
    }
  };

  // Remove a recipe from plan
  const handleRemove = async ({ day, mealType }) => {
    try {
      await axios.delete('http://localhost:5000/api/weekly-plan/remove', {
        data: { day, mealType },
        withCredentials: true,
      });
      fetchPlan();
    } catch (err) {
      console.error('Error removing recipe from plan:', err);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-yellow-800 mb-6">My Weekly Meal Plan</h1>
        <div className="overflow-x-auto">
          <table className="table-fixed border-collapse w-full text-sm">
            <thead>
              <tr>
                <th className="w-24"></th>
                {days.map((day) => (
                  <th key={day} className="border p-2 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal}>
                  <td className="font-bold p-2">{meal}</td>
                  {days.map((day, dayIndex) => {
                    const cellRecipe = plan.find((p) => p.day === day && p.mealType === meal);
                    return (
                      <td key={dayIndex} className="border p-1">
                        {cellRecipe ? (
                          <div className="bg-gray-100 rounded p-1">
                            <img
                              src={cellRecipe.image}
                              alt={cellRecipe.title}
                              className="h-16 w-full object-cover rounded"
                            />
                            <div className="flex justify-between items-center mt-1 px-1">
                              <span className="truncate text-sm">{cellRecipe.title}</span>
                              <button
                                onClick={() => handleRemove({ day: cellRecipe.day, mealType: cellRecipe.mealType })}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedSlot({ day, mealType: meal })}
                            className="text-gray-400 italic text-center w-full"
                          >
                            +
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SearchModal
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onSelect={(recipe) => {
          if (selectedSlot) {
            handleAdd({ ...selectedSlot, recipe });
            setSelectedSlot(null);
          }
        }}
      />
    </>
  );
};

export default WeeklyPlanPage;


import React from 'react';

const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
const meals = ['Breakfast', 'Lunch', 'Dinner'];

// Dữ liệu mẫu: Vietnamese Noodles cho breakfast mỗi ngày
const samplePlan = {
  Breakfast: Array(7).fill({
    name: 'Vietnamese Noodles',
    image: 'https://via.placeholder.com/80', // ảnh giả để demo
  }),
  Lunch: Array(7).fill(null),
  Dinner: Array(7).fill(null),
};

const WeeklyMealPlanner = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">WWL Plan 12.16.25</h2>
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border border-gray-300">
            <thead>
              <tr>
                <th className="w-28"></th>
                {days.map((day, idx) => (
                  <th key={idx} className="text-center py-2 border border-gray-300 font-medium">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal}>
                  <td className="text-left font-semibold px-4 py-3 border border-gray-300">{meal}</td>
                  {samplePlan[meal].map((item, idx) => (
                    <td key={idx} className="border border-gray-300 text-center h-32 align-top">
                      {item ? (
                        <div className="flex flex-col items-center justify-center p-2">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mb-1 rounded-md" />
                          <span className="text-sm font-semibold">{item.name}</span>
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMealPlanner;

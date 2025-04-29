import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f0ea] p-4 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border border-black p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-black" />
          <h1 className="font-bold text-lg">Recipe Discovery</h1>
        </div>
      </header>

      {/* Search Filter */}
      <div className="flex items-center gap-4 mb-6">
        <select className="px-4 py-2 rounded border border-black">
          <option>Ingredients</option>
        </select>
        <div className="flex-1 flex items-center border border-black rounded">
          <input
            type="text"
            className="flex-1 p-2 outline-none"
            placeholder="Search recipes..."
          />
          <button className="px-3">🔍</button>
        </div>
      </div>

      {/* Featured Cards */}
      <section className="mb-6">
        <h2 className="font-bold mb-2">Featured</h2>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded shadow p-2 flex flex-col gap-2 items-center"
            >
              <div className="w-full h-24 bg-gray-300 rounded" />
              <div className="flex justify-end w-full gap-2">
                <span className="text-red-600">❤️</span>
                <span className="text-black">🔖</span>
              </div>
              <div className="font-semibold">Vietnamese Noodles</div>
              <div className="flex items-center gap-2">
                <span>⤴️</span>
                <span>⭐</span>
                <span>-</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured List */}
      <section>
        <h2 className="font-bold mb-2">Featured</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead className="text-left">
              <tr className="border-b">
                <th className="p-2"> </th>
                <th className="p-2">Name</th>
                <th className="p-2"> </th>
                <th className="p-2">Rating</th>
                <th className="p-2">Prep Time</th>
                <th className="p-2">Cook Time</th>
                <th className="p-2">Date</th>
                <th className="p-2"> </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(2)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">
                    <div className="w-14 h-14 bg-gray-300 rounded" />
                  </td>
                  <td className="p-2">Vietnamese Noodles</td>
                  <td className="p-2">⤴️</td>
                  <td className="p-2">⭐ -</td>
                  <td className="p-2">5 mins</td>
                  <td className="p-2">5 mins</td>
                  <td className="p-2">Dec 14, 2020</td>
                  <td className="p-2 flex gap-2">
                    <span className="text-red-600">❤️</span>
                    <span>🔖</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

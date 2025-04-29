import React from "react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#fefde5] p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold">Recipe Master</h1>
        </div>
        <nav className="flex gap-6 text-gray-600">
          <a href="#">Recipe</a>
          <a href="#">Favourite</a>
          <a href="#">Create</a>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">👤</div>
            <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded p-2">
              <a href="#" className="block">Dashboard</a>
              <a href="#" className="block">Log out</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Admin Profile */}
      <section className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-4" />
        <h2 className="text-xl font-bold mb-4">ADMIN</h2>

        <div className="flex flex-col gap-4 items-center w-full max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-2 rounded-full border border-black shadow"
              value="Xdfdafdsf123#@"
              readOnly
            />
            <span className="absolute right-3 top-2.5 text-yellow-400">👁️</span>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              className="w-full p-2 rounded-full border border-black shadow"
              value="password"
              readOnly
            />
            <span className="absolute right-3 top-2.5 text-yellow-400">🛠️</span>
          </div>
          <button className="bg-yellow-300 border border-black px-6 py-1 rounded-full hover:bg-yellow-400">save</button>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-yellow-300 text-black">
            <tr>
              <th className="p-2">id</th>
              <th className="p-2">name</th>
              <th className="p-2">Date created</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, i) => (
              <tr key={i} className="bg-[#fffce5] border-b border-black">
                <td className="p-2">1</td>
                <td className="p-2">Tran Nam Son</td>
                <td className="p-2">12/4/2025</td>
                <td className="p-2 flex gap-2">
                  <span>📋</span>
                  <span>✏️</span>
                  <span>🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
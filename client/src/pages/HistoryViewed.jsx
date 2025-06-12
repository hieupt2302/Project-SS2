import React from "react";
import { Clock } from "lucide-react";


export default function HistoryViewed() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">History Viewed</h1>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-200 grid grid-cols-3 px-4 py-2 font-semibold text-gray-700">
          <span className="col-span-2">Item</span>
          <span>Viewed At</span>
        </div>
        {historyItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center px-4 py-2 border-t hover:bg-gray-50"
          >
            <div className="flex items-center col-span-2 space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-blue-700 font-medium">{item.name}</span>
            </div>
            <div className="text-sm text-gray-600">{item.viewedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { name: "butter", quantity: "7 TBSP", notes: "" },
  { name: "eggs", quantity: "7", notes: "for frying, optional" },
  { name: "milk of your choice", quantity: "2 cups, 2 oz, 1 tsp", notes: "sub water" },
  { name: "cream cheese", quantity: "4 TBSP", notes: "" },
  { name: "chicken thighs", quantity: "16 oz", notes: "chopped into smaller pieces, sub chicken breast" },
  { name: "plain greek yogurt", quantity: "16 oz", notes: "" },
  { name: "mixed frozen veggies", quantity: "6 oz", notes: "I used peas, carrots, and corn" },
];

export default function GroceryList() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">WWL Plan 12.16.20</h1>
        <div className="space-x-2">
          <Button>Save</Button>
          <Button>Email</Button>
          <Button>Print</Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-blue-900 text-white grid grid-cols-4 px-4 py-2 font-semibold">
          <span>refrigerated</span>
          <span></span>
          <span>notes</span>
          <span></span>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center px-4 py-2 border-t hover:bg-blue-50"
          >
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-blue-700 font-medium cursor-pointer hover:underline">
                {item.name}
              </span>
            </div>
            <div>{item.quantity}</div>
            <div className="italic text-gray-500 text-sm">{item.notes}</div>
            <div className="flex items-center space-x-2 justify-end">
              <Pencil className="w-4 h-4 text-blue-600 cursor-pointer" />
              <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

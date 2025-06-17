import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ query, onQueryChange, tags, setTags }) => {
  const [tagInput, setTagInput] = useState("");

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-3 bg-white border border-orange-200 rounded-2xl px-6 py-5 shadow-lg w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div className="flex items-center bg-orange-50 rounded-xl px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-300 transition">
        <Search className="text-orange-400 mr-2" size={22} />
        <input
          type="text"
          value={query}
          onChange={onQueryChange}
          placeholder="Search recipes by name..."
          className="outline-none flex-1 bg-transparent text-gray-700 text-base font-medium placeholder:text-orange-300"
        />
      </div>

      {/* Tag input */}
      <form onSubmit={handleTagAdd} className="flex gap-2 items-center">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add ingredient tag..."
          className="outline-none flex-1 border border-orange-200 rounded-xl px-3 py-2 bg-orange-50 focus:ring-2 focus:ring-orange-300 transition placeholder:text-orange-300"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow transition"
        >
          Add
        </button>
      </form>

      {/* Tag list */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-orange-200 transition"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 hover:bg-orange-300 rounded-full p-1 transition"
              type="button"
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
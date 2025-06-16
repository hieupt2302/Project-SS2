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
    <div className="flex flex-col gap-2 bg-white border rounded-lg px-4 py-3 shadow-md">
      <div className="flex items-center">
        <Search className="text-gray-500 mr-2" />
        <input
          type="text"
          value={query}
          onChange={onQueryChange}
          placeholder="Search recipes by name..."
          className="outline-none flex-1"
        />
      </div>

      <form onSubmit={handleTagAdd} className="flex gap-2 items-center">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add ingredient tag..."
          className="outline-none flex-1 border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="ml-1">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;


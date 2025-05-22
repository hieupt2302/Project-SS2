import { Search } from "lucide-react";

const SearchBar = ({ value, onChange }) => (
  <div className="flex items-center bg-white border rounded-lg px-4 py-2 shadow-md">
    <Search className="text-gray-500 mr-2" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search recipes..."
      className="outline-none flex-1"
    />
  </div>
);

export default SearchBar;

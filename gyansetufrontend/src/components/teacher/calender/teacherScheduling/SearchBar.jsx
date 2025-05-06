import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="pl-10 py-2 pr-3 block w-64 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
        placeholder="Search events..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

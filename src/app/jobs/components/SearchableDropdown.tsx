// src/components/SearchableDropdown.tsx
import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';

interface SearchableDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  toggleOption: (option: string) => void;
  buttonColor: string; // Tailwind color class (e.g., 'bg-purple-500')
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  selectedOptions,
  toggleOption,
  buttonColor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  // const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setHighlightedIndex(-1); // Reset highlight on search term change
  }, [searchTerm, options]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        toggleOption(filteredOptions[highlightedIndex]);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className={`flex items-center px-4 py-2 ${buttonColor} text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
        >
          <FaFilter className="mr-2" /> {label}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md p-4"
        onKeyDown={(e) => {
          // Prevent DropdownMenu from handling key events
          e.stopPropagation();
        }}
      >
        {/* Search Input */}
        <div className="relative mb-3">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${label}...`}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none"
          />
        </div>

        {/* Options List */}
        <ul>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option}
                onClick={() => toggleOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  highlightedIndex === index
                    ? 'bg-blue-100'
                    : selectedOptions.includes(option)
                    ? 'bg-gray-100'
                    : ''
                }`}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No options found.</li>
          )}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchableDropdown;

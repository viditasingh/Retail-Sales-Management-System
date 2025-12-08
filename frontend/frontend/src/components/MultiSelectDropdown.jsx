import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  paramKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(
        paramKey,
        selectedValues.filter((v) => v !== value)
      );
    } else {
      onChange(paramKey, [...selectedValues, value]);
    }
  };

  const displayText =
    selectedValues.length === 0 ? label : selectedValues.join(", ");

  const hasSelection = selectedValues.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-w-[150px] max-w-[280px] justify-between shadow-sm border ${
          hasSelection
            ? "bg-gray-100 border-gray-400 text-gray-900 hover:bg-gray-200"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
        } ${isOpen ? "ring-2 ring-gray-400/30 border-gray-400" : ""}`}
      >
        <span className="truncate" title={selectedValues.join(", ")}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {options.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm ${
                  selectedValues.includes(option)
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 accent-gray-800"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

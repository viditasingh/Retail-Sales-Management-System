import { useState, useRef, useEffect } from "react";

export default function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
  startParamKey,
  endParamKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hasSelection = startDate || endDate;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const displayText = hasSelection
    ? `${formatDate(startDate) || "Start"} → ${formatDate(endDate) || "End"}`
    : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-w-[140px] justify-between shadow-sm border ${
          hasSelection
            ? "bg-gray-100 border-gray-400 text-gray-900 hover:bg-gray-200"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
        } ${isOpen ? "ring-2 ring-gray-400/30 border-gray-400" : ""}`}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="truncate">{displayText}</span>
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
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5 min-w-[300px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <input
                type="date"
                value={startDate || ""}
                onChange={(e) => onChange(startParamKey, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="date"
                value={endDate || ""}
                onChange={(e) => onChange(endParamKey, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400"
              />
            </div>
            {hasSelection && (
              <button
                onClick={() => {
                  onChange(startParamKey, "");
                  onChange(endParamKey, "");
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function SearchBar() {
  const [params, setParams] = useSearchParams();

  const initValue = params.get("q") || "";
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    const delay = setTimeout(() => {
      const newParams = new URLSearchParams(params);

      if (value.trim() !== "") newParams.set("q", value.trim());
      else newParams.delete("q");

      newParams.delete("cursor");
      setParams(newParams);
    }, 300);

    return () => clearTimeout(delay);
  }, [value]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by name, phone..."
        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm hover:shadow-md focus:shadow-md focus:outline-none placeholder:text-gray-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

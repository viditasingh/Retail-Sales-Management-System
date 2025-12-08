import { useSearchParams } from "react-router";
import { SORT_OPTIONS } from "../utils/constants";

export default function Sorting() {
  const [params, setParams] = useSearchParams();

  const updateSort = (value) => {
    const newParams = new URLSearchParams(params);

    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }

    newParams.delete("cursor");

    setParams(newParams);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-gray-700 text-sm font-medium">Sort by:</label>

      <select
        className="border p-2 rounded text-sm"
        value={params.get("sort") || ""}
        onChange={(e) => updateSort(e.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

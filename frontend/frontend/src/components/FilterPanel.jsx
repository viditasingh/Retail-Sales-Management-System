import { useSearchParams } from "react-router";
import { FILTER_OPTIONS } from "../utils/constants";

export default function FilterPanel() {
  const [params, setParams] = useSearchParams();

  // Update multi-select filters
  const toggleValue = (key, value) => {
    const newParams = new URLSearchParams(params);

    const existing = newParams.getAll(key);

    if (existing.includes(value)) {
      // remove this filter
      const filtered = existing.filter((v) => v !== value);
      newParams.delete(key);
      filtered.forEach((v) => newParams.append(key, v));
    } else {
      newParams.append(key, value);
    }

    // reset pagination cursor when filters change
    newParams.delete("cursor");

    setParams(newParams);
  };

  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-md h-fit">
      <h2 className="font-semibold mb-4">Filters</h2>

      {/* CUSTOMER REGION */}
      <div>
        <p className="font-medium mb-2">Customer Region</p>
        <div className="flex flex-col gap-1 text-sm">
          {FILTER_OPTIONS.regions.map((region) => (
            <label key={region} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("region").includes(region)}
                onChange={() => toggleValue("region", region)}
              />
              {region}
            </label>
          ))}
        </div>
      </div>

      {/* GENDER */}
      <div className="mt-4">
        <p className="font-medium mb-2">Gender</p>
        <div className="flex flex-col gap-1 text-sm">
          {FILTER_OPTIONS.genders.map((g) => (
            <label key={g} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("gender").includes(g)}
                onChange={() => toggleValue("gender", g)}
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* AGE RANGE */}
      <div className="mt-4">
        <p className="font-medium mb-2">Age Range</p>
        <div className="flex gap-2 text-sm">
          <input
            type="number"
            placeholder="Min"
            className="w-20 p-1 border rounded"
            value={params.get("age_min") || ""}
            onChange={(e) => {
              const newP = new URLSearchParams(params);
              newP.set("age_min", e.target.value);
              newP.delete("cursor");
              setParams(newP);
            }}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-20 p-1 border rounded"
            value={params.get("age_max") || ""}
            onChange={(e) => {
              const newP = new URLSearchParams(params);
              newP.set("age_max", e.target.value);
              newP.delete("cursor");
              setParams(newP);
            }}
          />
        </div>
      </div>

      {/* PRODUCT CATEGORY */}
      <div className="mt-4">
        <p className="font-medium mb-2">Product Category</p>

        <div className="flex flex-col gap-1 text-sm">
          {FILTER_OPTIONS.categories.map((cat) => (
            <label key={cat} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("category").includes(cat)}
                onChange={() => toggleValue("category", cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* TAGS */}
      <div className="mt-4">
        <p className="font-medium mb-2">Tags</p>

        <div className="flex flex-col gap-1 text-sm">
          {FILTER_OPTIONS.tags.map((tag) => (
            <label key={tag} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("tags").includes(tag)}
                onChange={() => toggleValue("tags", tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="mt-4">
        <p className="font-medium mb-2">Payment Method</p>

        <div className="flex flex-col gap-1 text-sm">
          {FILTER_OPTIONS.paymentMethods.map((method) => (
            <label key={method} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("payment_method").includes(method)}
                onChange={() => toggleValue("payment_method", method)}
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="mt-4">
        <p className="font-medium mb-2">Date</p>

        <div className="flex flex-col gap-2 text-sm">
          {/* START DATE */}
          <input
            type="date"
            className="p-1 border rounded"
            value={params.get("date_from") || ""}
            onChange={(e) => {
              const newParams = new URLSearchParams(params);
              if (e.target.value) {
                newParams.set("date_from", e.target.value);
              } else {
                newParams.delete("date_from");
              }
              newParams.delete("cursor"); // reset pagination
              setParams(newParams);
            }}
          />

          {/* END DATE */}
          <input
            type="date"
            className="p-1 border rounded"
            value={params.get("date_to") || ""}
            onChange={(e) => {
              const newParams = new URLSearchParams(params);
              if (e.target.value) {
                newParams.set("date_to", e.target.value);
              } else {
                newParams.delete("date_to");
              }
              newParams.delete("cursor");
              setParams(newParams);
            }}
          />
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        className="mt-6 w-full p-2 bg-gray-100 rounded"
        onClick={() => setParams({})}
      >
        Reset Filters
      </button>
    </div>
  );
}

import { useSearchParams } from "react-router";

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
          {["East", "West", "North", "South"].map((region) => (
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
          {["Male", "Female", "Other"].map((g) => (
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
            value={params.get("min_age") || ""}
            onChange={(e) => {
              const newP = new URLSearchParams(params);
              newP.set("min_age", e.target.value);
              newP.delete("cursor");
              setParams(newP);
            }}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-20 p-1 border rounded"
            value={params.get("max_age") || ""}
            onChange={(e) => {
              const newP = new URLSearchParams(params);
              newP.set("max_age", e.target.value);
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
          {["Clothing", "Electronics", "Beauty"].map((cat) => (
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
          {[
            "Sale",
            "Discount",
            "New Arrival",
            "Trending",
            "Popular",
            "Limited Stock",
          ].map((tag) => (
            <label key={tag} className="flex gap-2">
              <input
                type="checkbox"
                checked={params.getAll("tag").includes(tag)}
                onChange={() => toggleValue("tag", tag)}
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
          {["UPI", "Credit Card", "Debit Card", "Cash", "Wallet"].map(
            (method) => (
              <label key={method} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={params.getAll("payment").includes(method)}
                  onChange={() => toggleValue("payment", method)}
                />
                {method}
              </label>
            )
          )}
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
            value={params.get("start_date") || ""}
            onChange={(e) => {
              const newParams = new URLSearchParams(params);
              if (e.target.value) {
                newParams.set("start_date", e.target.value);
              } else {
                newParams.delete("start_date");
              }
              newParams.delete("cursor"); // reset pagination
              setParams(newParams);
            }}
          />

          {/* END DATE */}
          <input
            type="date"
            className="p-1 border rounded"
            value={params.get("end_date") || ""}
            onChange={(e) => {
              const newParams = new URLSearchParams(params);
              if (e.target.value) {
                newParams.set("end_date", e.target.value);
              } else {
                newParams.delete("end_date");
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

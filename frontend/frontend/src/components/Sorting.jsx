import { useSearchParams } from "react-router";

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
        <option value="">Default</option>
        <option value="customer_name">Customer Name (A–Z)</option>
        <option value="date_desc">Date (Newest First)</option>
        <option value="product_name">Product Name (A–Z)</option>
        <option value="quantity">Quantity ↓(low-high)</option>
        <option value="quantity_desc">Quantity ↑(high-low)</option>
      </select>
    </div>
  );
}

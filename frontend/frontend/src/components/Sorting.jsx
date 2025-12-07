export default function Sorting() {
  return (
    <div className="mb-4 flex justify-end">
      <select className="p-2 border rounded-lg shadow-sm">
        <option value="">Sort By</option>
        <option value="customer_name">Customer Name (A–Z)</option>
        <option value="date">Date (Newest)</option>
        <option value="product_name">Product Name (A–Z)</option>
        <option value="quantity">Quantity</option>
      </select>
    </div>
  );
}

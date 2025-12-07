export default function Transactions({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-gray-600">
          <tr>
            <th className="p-2">Transaction ID</th>
            <th className="p-2">Date</th>
            <th className="p-2">Customer ID</th>
            <th className="p-2">Customer Name</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Gender</th>
            <th className="p-2">Age</th>
            <th className="p-2">Product Category</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total Amount</th>
            <th className="p-2">Customer Region</th>
            <th className="p-2">Product ID</th>
            <th className="p-2">Employee Name</th>
          </tr>
        </thead>

        <tbody>
          {data?.results?.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2 font-medium">{row.id}</td>
              <td className="p-2">
                {row.date ? new Date(row.date).toLocaleDateString() : "--"}
              </td>
              <td className="p-2">{row.customer_id}</td>
              <td className="p-2">{row.customer_name}</td>
              <td className="p-2">{row.phone_number}</td>
              <td className="p-2">{row.gender}</td>
              <td className="p-2">{row.age}</td>
              <td className="p-2">{row.product_category}</td>
              <td className="p-2">{row.quantity}</td>
              <td className="p-2">{row.total_amount}</td>
              <td className="p-2">{row.customer_region}</td>
              <td className="p-2">{row.product_id}</td>
              <td className="p-2">{row.employee_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

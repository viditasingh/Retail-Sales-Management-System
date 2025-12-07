export default function Transactions({data}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2">Customer</th>
            <th className="p-2">Product</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.results?.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{row.customer_name}</td>
              <td className="p-2">{row.product_name}</td>
              <td className="p-2">{row.final_amount}</td>
              <td className="p-2">
                {new Date(row.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

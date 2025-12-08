import Skeleton from "./Skeleton";
import { TABLE_HEADERS } from "../utils/constants";

export default function Transactions({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-max">
          <thead className="border-b text-gray-600">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th key={header} className="p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b">
                {TABLE_HEADERS.map((_, idx) => (
                  <td key={idx} className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data?.results?.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="text-gray-400 text-5xl">📭</div>
        <p className="text-gray-600 text-lg">No transactions found</p>
        <p className="text-gray-500 text-sm max-w-sm">
          Try adjusting your search, filters, or date range to find results.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <table className="w-full text-left text-sm min-w-max">
        <thead className="border-b text-gray-600">
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th key={header} className="p-2">
                {header}
              </th>
            ))}
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

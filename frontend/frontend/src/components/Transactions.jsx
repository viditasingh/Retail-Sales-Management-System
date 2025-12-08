import { useState } from "react";
import Skeleton from "./Skeleton";
import { TABLE_HEADERS } from "../utils/constants";

// Format phone number as +91 1234567890
const formatPhoneNumber = (phone) => {
  if (!phone) return "--";
  const phoneStr = String(phone);
  // If starts with 91 and is longer than 10 digits, format as +91 XXXXXXXXXX
  if (phoneStr.startsWith("91") && phoneStr.length > 10) {
    return `+91 ${phoneStr.slice(2)}`;
  }
  // If it's 10 digits, assume Indian number
  if (phoneStr.length === 10) {
    return `+91 ${phoneStr}`;
  }
  return phoneStr;
};

export default function Transactions({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i}>
                  {TABLE_HEADERS.map((_, idx) => (
                    <td key={idx} className="px-5 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data?.results?.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <div>
          <p className="text-gray-700 text-lg font-semibold">
            No transactions found
          </p>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">
            Try adjusting your search, filters, or date range to find results.
          </p>
        </div>
      </div>
    );
  }

  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data?.results?.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-semibold text-indigo-600">
                  #{row.id}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {row.date
                    ? new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "--"}
                </td>
                <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                  {row.customer_id}
                </td>
                <td className="px-5 py-4 text-gray-900 font-medium">
                  {row.customer_name}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      {formatPhoneNumber(row.phone_number)}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          formatPhoneNumber(row.phone_number),
                          row.id
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={
                        copiedId === row.id ? "Copied!" : "Copy phone number"
                      }
                    >
                      {copiedId === row.id ? (
                        <svg
                          className="w-3.5 h-3.5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.gender === "Male"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-pink-50 text-pink-700"
                    }`}
                  >
                    {row.gender}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600">{row.age}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                    {row.product_category}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600 font-medium">
                  {row.quantity}
                </td>
                <td className="px-5 py-4 font-semibold text-emerald-600">
                  ${row.total_amount?.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {row.customer_region}
                </td>
                <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                  {row.product_id}
                </td>
                <td className="px-5 py-4 text-gray-600">{row.employee_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

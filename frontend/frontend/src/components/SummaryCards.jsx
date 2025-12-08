import { useStats } from "../hooks/useStats";
import Skeleton from "./Skeleton";
import { SUMMARY_CARDS } from "../utils/constants";

const cardStyles = ["bg-indigo-600", "bg-emerald-600", "bg-amber-500"];

const iconPaths = [
  "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", // cube
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // currency
  "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", // tag
];

// Format number in Indian format (lakhs, crores)
const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return "0";
  const numStr = Math.round(Number(num)).toString();
  if (numStr.length <= 3) return numStr;

  let result = "";
  let count = 0;

  for (let i = numStr.length - 1; i >= 0; i--) {
    result = numStr[i] + result;
    count++;
    if (i > 0) {
      if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
        result = "," + result;
      }
    }
  }
  return result;
};

const formatValue = (key, value) => {
  if (key === "total_amount" || key === "total_discount") {
    return `₹${formatIndianNumber(value)}`;
  }
  return formatIndianNumber(value);
};

export default function SummaryCards() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6 mb-8">
        {SUMMARY_CARDS.map((item, idx) => (
          <div
            key={item.key}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {SUMMARY_CARDS.map((item, idx) => (
        <div
          key={item.key}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 rounded-lg ${cardStyles[idx]} flex items-center justify-center`}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={iconPaths[idx]}
                />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-semibold">{item.label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(item.key, data[item.key])}
          </p>
        </div>
      ))}
    </div>
  );
}

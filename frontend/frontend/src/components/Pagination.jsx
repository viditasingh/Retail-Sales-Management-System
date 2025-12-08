import { useSearchParams } from "react-router";
import Skeleton from "./Skeleton";

export default function Pagination({ next, previous }) {
  const [params, setParams] = useSearchParams();

  const goToPage = (url) => {
    if (!url) return;

    const cursor = new URL(url, window.location.origin).searchParams.get(
      "cursor"
    );

    const newParams = new URLSearchParams(params);
    newParams.set("cursor", cursor);

    setParams(newParams);
  };

  if (!next && !previous) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => goToPage(previous)}
        disabled={!previous}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          previous
            ? "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-2"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      {/* Visual page indicator */}
      <div className="flex items-center gap-1.5 mx-4">
        {[1, 2, 3].map((num, idx) => (
          <span
            key={num}
            className={`w-2 h-2 rounded-full ${
              idx === 0 ? "w-6 bg-black" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => goToPage(next)}
        disabled={!next}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          next
            ? "bg-black hover:bg-white hover:text-black hover:border-2 text-white"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

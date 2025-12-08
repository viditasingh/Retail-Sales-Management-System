import { useSearchParams } from "react-router";
import { useMemo, useEffect } from "react";
import Skeleton from "./Skeleton";

export default function Pagination({ next, previous }) {
  const [params, setParams] = useSearchParams();

  // Get cursor stack from URL param (as JSON array)
  const getCursorStack = () => {
    const stackStr = params.get("cursor_stack");
    if (!stackStr) return [];
    try {
      return JSON.parse(stackStr);
    } catch {
      return [];
    }
  };

  const cursorStack = useMemo(getCursorStack, [params]);
  const getCurrentCursor = () => params.get("cursor") || null;

  // Reset cursor stack if filters/search change (i.e., if not paginating)
  useEffect(() => {
    // If no cursor, clear stack
    if (!params.get("cursor") && params.get("cursor_stack")) {
      const newParams = new URLSearchParams(params);
      newParams.delete("cursor_stack");
      setParams(newParams);
    }
  }, [params]);

  // Go to next page: push current cursor to stack, set new cursor, update stack in URL
  const goToNext = () => {
    if (!next) return;
    const currentCursor = getCurrentCursor();
    // Always push currentCursor (even if null) to stack
    const newStack = [...cursorStack, currentCursor];
    const cursor = new URL(next, window.location.origin).searchParams.get(
      "cursor"
    );
    const newParams = new URLSearchParams(params);
    newParams.set("cursor", cursor);
    newParams.set("cursor_stack", JSON.stringify(newStack));
    setParams(newParams);
  };

  // Go to previous page: pop last cursor from stack, set it, update stack in URL
  const goToPrevious = () => {
    if (!previous) return;
    if (cursorStack.length === 0) return;
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    const newParams = new URLSearchParams(params);
    if (prevCursor === null) {
      newParams.delete("cursor"); // Go to first page
    } else if (prevCursor) {
      newParams.set("cursor", prevCursor);
    } else {
      newParams.delete("cursor");
    }
    if (newStack.length > 0) {
      newParams.set("cursor_stack", JSON.stringify(newStack));
    } else {
      newParams.delete("cursor_stack");
    }
    setParams(newParams);
  };

  if (!next && !previous) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={goToPrevious}
        disabled={!previous || cursorStack.length === 0}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          previous && cursorStack.length > 0
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
        onClick={goToNext}
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

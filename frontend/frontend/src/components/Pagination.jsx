import { useSearchParams } from "react-router";

export default function Pagination({ next, previous }) {
  const [params, setParams] = useSearchParams();

  const goToPage = (url) => {
    if (!url) return;

    // console.log("GO TO PAGE URL:", url);
    const cursor = new URL(url, window.location.origin).searchParams.get(
      "cursor"
    );
    // console.log("EXTRACTED CURSOR:", cursor);

    const newParams = new URLSearchParams(params);
    newParams.set("cursor", cursor);

    setParams(newParams);
  };

  if (!next && !previous) {
    return (
      <div className="flex justify-center py-4">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => goToPage(previous)}
        disabled={!previous}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        {"<"}
      </button>

      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          disabled
          className="px-3 py-1 border rounded bg-gray-100 text-gray-400"
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => goToPage(next)}
        disabled={!next}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        {">"}
      </button>
    </div>
  );
}

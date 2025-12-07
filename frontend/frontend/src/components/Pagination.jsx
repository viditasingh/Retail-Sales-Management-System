import { useSearchParams } from "react-router";

export default function Pagination({ next, previous }) {
  const [params, setParams] = useSearchParams();

  const goToPage = (url) => {
  if (!url) return;

  // console.log("GO TO PAGE URL:", url);
  const cursor = new URL(url, window.location.origin).searchParams.get("cursor");
  // console.log("EXTRACTED CURSOR:", cursor);

  const newParams = new URLSearchParams(params);
  newParams.set("cursor", cursor);

  setParams(newParams);
};


  return (
    <div className="flex justify-between py-4">
      <button
        onClick={() => goToPage(previous)}
        disabled={!previous}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <button
        onClick={() => goToPage(next)}
        disabled={!next}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>

  );
}

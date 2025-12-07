export default function Pagination({ next, previous }) {
  return (
    <div className="flex justify-between py-4">
      <button
        disabled={!previous}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <button
        disabled={!next}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

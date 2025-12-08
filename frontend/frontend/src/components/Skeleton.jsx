export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg ${className}`}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

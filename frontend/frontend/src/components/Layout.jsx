export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-8">{children}</div>
    </div>
  );
}

import { useTransactions } from "../hooks/useTransactions";

export default function TransactionsPage() {
  const { data, isLoading, error } = useTransactions();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error fetching data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

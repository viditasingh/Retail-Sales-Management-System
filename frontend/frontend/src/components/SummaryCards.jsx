import { useStats } from "../hooks/useStats";
import Skeleton from "./Skeleton";

export default function SummaryCards() {
  const { data, isLoading } = useStats();
  const card = "bg-white shadow rounded-xl p-4 w-full";

  if (isLoading) {
    return (
      <div className="flex gap-4 mb-6">
        <div className="bg-white shadow rounded-xl p-4 w-full">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="bg-white shadow rounded-xl p-4 w-full">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="bg-white shadow rounded-xl p-4 w-full">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-6">
      <div className={card}>
        <p className="text-gray-500 text-sm">Total Units Sold</p>
        <p className="text-xl font-semibold">{data.total_units}</p>
      </div>
      <div className={card}>
        <p className="text-gray-500 text-sm">Total Amount</p>
        <p className="text-xl font-semibold">{data.total_amount}</p>
      </div>
      <div className={card}>
        <p className="text-gray-500 text-sm">Total Discount</p>
        <p className="text-xl font-semibold">{data.total_discount}</p>
      </div>
    </div>
  );
}

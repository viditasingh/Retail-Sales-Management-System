import { useStats } from "../hooks/useStats";
import Skeleton from "./Skeleton";
import { SUMMARY_CARDS } from "../utils/constants";

export default function SummaryCards() {
  const { data, isLoading } = useStats();
  const card = "bg-white shadow rounded-xl p-4 w-full";

  if (isLoading) {
    return (
      <div className="flex gap-4 mb-6">
        {SUMMARY_CARDS.map((item) => (
          <div key={item.key} className="bg-white shadow rounded-xl p-4 w-full">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-6">
      {SUMMARY_CARDS.map((item) => (
        <div key={item.key} className={card}>
          <p className="text-gray-500 text-sm">{item.label}</p>
          <p className="text-xl font-semibold">{data[item.key]}</p>
        </div>
      ))}
    </div>
  );
}

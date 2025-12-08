import { useStats } from "../hooks/useStats"

export default function SummaryCards() {

  const {data, isLoading} = useStats();
  const card = "bg-white shadow rounded-xl p-4 w-full";

  if(isLoading){
    return(
      <div className="flex gap-4 mb-6">
        <div className={card}>Loading...</div>
        <div className={card}>Loading...</div>
        <div className={card}>Loading...</div>
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
  )
}

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Sorting from "../components/Sorting";
import Transactions from "../components/Transactions";
import Pagination from "../components/Pagination";
import { useTransactions } from "../hooks/useTransactions";
import SummaryCards from "../components/SummaryCards";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <SearchBar />
      </div>

      <div className="flex gap-6">
        {/* Left side filters */}
        <FilterPanel />

        {/* Right side content */}
        <div className="flex-1 p-6 min-w-0">
          <Sorting />
          <SummaryCards />

          {isLoading ? (
            <Transactions data={null} />
          ) : (
            <>
              <Transactions data={data} />
              <Pagination next={data?.next} previous={data?.previous} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

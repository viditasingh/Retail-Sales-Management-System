import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Sorting from "../components/Sorting";
import Transactions from "../components/Transactions";
import Pagination from "../components/Pagination";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();

  return (
    <Layout>
      <SearchBar />

      <div className="flex gap-6">
        {/* Left side filters */}
        <FilterPanel />

        {/* Right side content */}
        <div className="flex-1">
          <Sorting />

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Transactions data={data} />
              <Pagination
                next={data?.next}
                previous={data?.previous}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

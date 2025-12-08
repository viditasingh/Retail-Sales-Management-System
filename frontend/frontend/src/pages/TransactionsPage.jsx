import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Sorting from "../components/Sorting";
import Transactions from "../components/Transactions";
import Pagination from "../components/Pagination";
import { useTransactions } from "../hooks/useTransactions";
import SummaryCards from "../components/SummaryCards";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();

  return (
    <Layout>
      {/* Header with Title and Search */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sales Management System
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your transactions
          </p>
        </div>
        <div className="w-96">
          <SearchBar />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between mb-6">
        <FilterBar />
        <Sorting />
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Transactions Table */}
      {isLoading ? (
        <Transactions data={null} />
      ) : (
        <>
          <Transactions data={data} />
          <Pagination next={data?.next} previous={data?.previous} />
        </>
      )}
    </Layout>
  );
}

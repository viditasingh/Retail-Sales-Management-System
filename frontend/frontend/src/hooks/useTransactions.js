import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export function useTransactions() {
  const [params] = useSearchParams();
  const queryString = params.toString();

  return useQuery({
    queryKey: ["transactions", queryString],
    queryFn: async () => {
      const res = await API.get(`/transactions/?${queryString}`);
      return res.data;
    },
  });
}

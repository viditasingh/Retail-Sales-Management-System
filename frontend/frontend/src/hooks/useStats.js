import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export function useStats() {
  const [params] = useSearchParams();
  const query = params.toString();

  return useQuery({
    queryKey: ["stats", query],
    queryFn: async () => {
      const res = await API.get(`/stats/?${query}`);
      return res.data;
    },
  });
}

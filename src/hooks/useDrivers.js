import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../services/axiosSecure";

const useDrivers = (status, page, search) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["drivers", status, page, search],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/drivers?status=${status}&page=${page}&search=${search}`,
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  return {
    drivers: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError,
    refetch,
  };
};

export default useDrivers;

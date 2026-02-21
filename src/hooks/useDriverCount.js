import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../services/axiosSecure";

const useDriverCount = (status) => {
  const { data } = useQuery({
    queryKey: ["driver-count", status],
    queryFn: async () => {
      const res = await axiosSecure.get(`/drivers?status=${status}`);
      return res.data?.data?.length || 0;
    },
    staleTime: 1000 * 60, // 1 minute cache
  });

  return data || 0;
};

export default useDriverCount;

import { useAuth } from "@/contexts/AuthContext";
import { getHyperliquidFees } from "@/lib/api/reyaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFeesQuery = (index: number) => {
  const { user, signout, setFeesData } = useAuth();
  return useQuery({
    queryKey: ["use-fees-query"],
    queryFn: () => getHyperliquidFees(user || "", index, signout),
    // staleTime: Infinity,
  });
};

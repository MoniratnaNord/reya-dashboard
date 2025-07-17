import { useAuth } from "@/contexts/AuthContext";
import { getHyperliquidFees } from "@/lib/api/reyaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFeesQuery = () => {
  const { signout, setFeesData } = useAuth();
  return useMutation({
    mutationKey: ["use-fees-query"],
    mutationFn: () => getHyperliquidFees(signout),
    onSuccess: (data: any) => {
      const coinWiseFees: any = {};

      for (const item of data) {
        if (!coinWiseFees[item.coin]) {
          coinWiseFees[item.coin] = 0;
        }
        coinWiseFees[item.coin] += Number(item.fee);
      }
      setFeesData(coinWiseFees);
      console.log("checking inside fees", coinWiseFees);
      if (data) {
        localStorage.setItem("hasCalledOnceAfterLogin", "true");
      }
    },
  });
};

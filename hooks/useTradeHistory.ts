import { useAuth } from "@/contexts/AuthContext";
import { getTradeHistory } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useTradeHistory = (market_index: number = 0, time: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgeHistory", market_index, time],
		queryFn: () => getTradeHistory(market_index, time, user || "", signout),
	});
};

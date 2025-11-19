import { useAuth } from "@/contexts/AuthContext";
import {
	getAvgAmm,
	getTradeHistory,
	getTradeSummary,
	hedgingPosition,
} from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useAvgAmm = (market_index: number = 0, time: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useAvgAmm", market_index, time],
		queryFn: () => getAvgAmm(market_index, time, user || "", signout),
	});
};

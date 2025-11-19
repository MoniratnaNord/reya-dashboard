import { useAuth } from "@/contexts/AuthContext";
import { getTradeSummary } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useTradeSummary = (market_index: number = 0, time: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgeSummary", market_index, time],
		queryFn: () => getTradeSummary(market_index, time, user || "", signout),
		refetchOnWindowFocus: false,
	});
};

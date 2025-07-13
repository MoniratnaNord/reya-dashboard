import { useAuth } from "@/contexts/AuthContext";
import { pnlForHedge, pnlSinceInception } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgePnl = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgePnl"],
		queryFn: () => pnlForHedge(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

import { useAuth } from "@/contexts/AuthContext";
import { pnlSinceInception } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useInceptionPnl = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useInceptionPnl"],
		queryFn: () => pnlSinceInception(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

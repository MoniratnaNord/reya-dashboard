import { useAuth } from "@/contexts/AuthContext";
import { ammSummary } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useAmmData = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useInceptionPnl"],
		queryFn: () => ammSummary(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

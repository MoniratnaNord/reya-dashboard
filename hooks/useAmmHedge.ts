import { useAuth } from "@/contexts/AuthContext";
import { ammHedge, ammSummary } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useAmmHedge = (market_index: number = 0, time: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useAmmHedge", market_index, time],
		queryFn: () => ammHedge(market_index, time, user || "", signout),
	});
};

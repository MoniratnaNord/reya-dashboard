import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgefees } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgeFees = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgeFees"],
		queryFn: () => fetchHedgefees(market_index, user || "", signout),
		refetchInterval: 900000,
		refetchIntervalInBackground: true,
	});
};

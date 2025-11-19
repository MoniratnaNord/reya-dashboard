import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgeData } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgeData = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgeData", market_index],
		queryFn: () => fetchHedgeData(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

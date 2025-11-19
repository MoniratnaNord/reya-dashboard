import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgeSummaryFirstLast } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchHedgeSummary = (
	market_index: number,
	refetchInterval: number = 30000,
	refetch: boolean = true
) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useFetchHedgeSummary", market_index],
		queryFn: () =>
			fetchHedgeSummaryFirstLast(market_index, user || "", signout),
		refetchInterval: refetchInterval,
		refetchOnWindowFocus: refetch,
		refetchIntervalInBackground: true,
	});
};

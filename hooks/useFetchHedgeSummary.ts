import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgeSummaryFirstLast } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchHedgeSummary = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useFetchHedgeSummary"],
		queryFn: () =>
			fetchHedgeSummaryFirstLast(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

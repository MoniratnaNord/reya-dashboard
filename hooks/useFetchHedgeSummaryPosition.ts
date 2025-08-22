import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgeSummaryPosition } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchHedgeSummaryPosition = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useFetchHedgeSummaryPosition"],
		queryFn: () => fetchHedgeSummaryPosition(market_index, user || "", signout),
		refetchInterval: 900000,
		refetchIntervalInBackground: true,
	});
};

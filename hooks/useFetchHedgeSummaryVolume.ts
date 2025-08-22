import { useAuth } from "@/contexts/AuthContext";
import { fetchHedgeSummaryVolume } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchHedgeSummaryVolume = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useFetchHedgeSummaryVolume"],
		queryFn: () => fetchHedgeSummaryVolume(market_index, user || "", signout),
		refetchInterval: 900000,
		refetchIntervalInBackground: true,
	});
};

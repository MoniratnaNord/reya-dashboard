import { useAuth } from "@/contexts/AuthContext";
import { fetchAmmPositionCount } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchAmmPosition = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useFetchAmmPositionCount"],
		queryFn: () => fetchAmmPositionCount(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

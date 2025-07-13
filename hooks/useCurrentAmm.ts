import { useAuth } from "@/contexts/AuthContext";
import { getCurrentAmmPositions } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useCurrentAmm = (market_index: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["getCurrentAmm"],
		queryFn: () => getCurrentAmmPositions(market_index, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

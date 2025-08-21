import { useAuth } from "@/contexts/AuthContext";
import { rebalancePosition } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useRebalancePosition = (
	market_index: number = 0,
	skip: number = 0
) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useRebalancePosition", skip],
		queryFn: () => rebalancePosition(market_index, skip, user || "", signout),
	});
};

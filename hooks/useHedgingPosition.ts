import { useAuth } from "@/contexts/AuthContext";
import { hedgingPosition } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgingPosition = (
	market_index: number = 0,
	skip: number = 0
) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgePosition", skip],
		queryFn: () => hedgingPosition(market_index, skip, user || "", signout),
	});
};

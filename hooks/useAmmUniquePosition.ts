import { useAuth } from "@/contexts/AuthContext";
import { ammUniquePositions } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useAmmUniquePosition = (
	market_index: number = 0,
	skip: number = 0
) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useAmmUniquePosition", skip],
		queryFn: () => ammUniquePositions(market_index, skip, user || "", signout),
	});
};

import { useAuth } from "@/contexts/AuthContext";
import { getOrderHistory } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useOrderHistory = (market_index: number = 0, time: number) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useOrderHistory", market_index, time],
		queryFn: () => getOrderHistory(market_index, time, user || "", signout),
		refetchOnWindowFocus: false,
	});
};

import { useAuth } from "@/contexts/AuthContext";
import { rebalanceOverview } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useRebalanceOverview = () => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useRebalanceOverview"],
		queryFn: () => rebalanceOverview(),
	});
};

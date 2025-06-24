import { useAuth } from "@/contexts/AuthContext";
import { pnlForHedge, pnlSinceInception } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgePnl = () => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgePnl"],
		queryFn: () => pnlForHedge(0, user || "", signout),
	});
};

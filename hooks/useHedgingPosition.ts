import { useAuth } from "@/contexts/AuthContext";
import { hedgingPosition, pnlSinceInception } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useHedgingPosition = (skip: number = 0) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useHedgePosition", skip],
		queryFn: () => hedgingPosition(0, skip, user || "", signout),
	});
};

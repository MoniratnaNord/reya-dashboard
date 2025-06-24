import { useAuth } from "@/contexts/AuthContext";
import { pnlSinceInception } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useInceptionPnl = () => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useInceptionPnl"],
		queryFn: () => pnlSinceInception(0, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

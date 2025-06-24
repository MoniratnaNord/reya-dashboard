import { useAuth } from "@/contexts/AuthContext";
import { getCurrentAmmPositions } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useCurrentAmm = () => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["getCurrentAmm"],
		queryFn: () => getCurrentAmmPositions(0, user || "", signout),
		refetchInterval: 30000,
		refetchIntervalInBackground: true,
	});
};

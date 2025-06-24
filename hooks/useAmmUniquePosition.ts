import { useAuth } from "@/contexts/AuthContext";
import { ammUniquePositions } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useAmmUniquePosition = (skip: number = 0) => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useAmmUniquePosition", skip],
		queryFn: () => ammUniquePositions(0, skip, user || "", signout),
	});
};

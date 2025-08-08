import { useAuth } from "@/contexts/AuthContext";
import { marketList } from "@/lib/api/reyaApi";
import { useQuery } from "@tanstack/react-query";

export const useMarketList = () => {
	const { user, signout } = useAuth();
	return useQuery({
		queryKey: ["useMarketList"],
		queryFn: () => marketList(user || "", signout),
	});
};

import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
export const getCurrentAmmPositions = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/position/amm-position?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const ammSummary = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/amm-summary?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchAmmPositionCount = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/amm-position-count?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchHedgeData = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/hedge-summary?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchHedgefees = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/hedge-summary-fees?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchHedgeSummaryFirstLast = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/hedge-summary-first-last?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchHedgeSummaryVolume = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/hedge-summary-volume?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const fetchHedgeSummaryPosition = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/hedge-summary-position-count?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const pnlForHedge = async (
	market_index: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/position/pnl-hedge-new?market_index=${market_index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const hedgingPosition = async (
	market_index: number = 0,
	skip: number = 0,
	token: string,
	signout: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/position/hedge?market_index=${market_index}&skip=${skip}&limit=10`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signout();
	}
	return res.data;
};
export const ammUniquePositions = async (
	market_index: number = 0,
	skip: number = 0,
	token: string,
	signOut: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/position/amm-unique-position?market_index=${market_index}&skip=${skip}&limit=10`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signOut();
	}
	return res.data;
};
export const rebalancePosition = async (
	market_index: number = 0,
	skip: number = 0,
	token: string,
	signOut: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/position/rebalance?market_index=${market_index}&skip=${skip}&limit=10`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signOut();
	}
	return res.data;
};

export const rebalanceOverview = async () => {
	const res = await axios.get(
		`https://api.reya.xyz/api/accounts/0x9ee2aad770920d985f531882dbb69e81681c8a2f/marginAccount/102621 `,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	return res.data;
};
export const marketList = async (token: string, signOut: () => void) => {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/market`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	if (res.status === 401) {
		signOut();
	}
	return res.data;
};
export const getHyperliquidFees = async (
	token: string,
	index: number,
	signOut: () => void
) => {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/api/trade/fees?market_index=${index}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (res.status === 401) {
		signOut();
	}
	return res.data;
};

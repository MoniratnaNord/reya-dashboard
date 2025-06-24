"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	Percent,
	Clock,
	Target,
	Loader2,
} from "lucide-react";
import { useCurrentAmm } from "@/hooks/useCurrentAmm";
import { useHedgePnl } from "@/hooks/useHedgePnl";
import { useInceptionPnl } from "@/hooks/useInceptionPnl";
import { useAuth } from "@/contexts/AuthContext";

interface RebalanceData {
	platform: string;
	totalValue: number;
	rebalanceCount: number;
	lastRebalance: string;
	targetAllocation: { asset: string; percentage: number; current: number }[];
	performance: { period: string; return: number }[];
	status: "active" | "pending" | "completed";
}

export function RebalanceSummary() {
	const [selectedPlatform, setSelectedPlatform] = useState<string>("");
	const { signout } = useAuth();
	const {
		data: ammPosition,
		isLoading: ammLoading,
		isError: ammError,
	} = useCurrentAmm();
	const {
		data: hedgePnl,
		isLoading: hedgeLoading,
		isError: hedgeError,
	} = useHedgePnl();
	const {
		data: inceptionPnl,
		isLoading: inceptionLoading,
		isError: inceptionError,
	} = useInceptionPnl();
	console.log(
		"checking data data data:\n",
		ammPosition,
		hedgePnl,
		inceptionPnl,
		ammError,
		hedgeError,
		inceptionError
	);
	if (ammError || hedgeError || inceptionError) {
		signout();
	}
	const {
		amm_trackers,
		hedge_pnl,
		hedge_position_amt_usd,
		hedge_pnl_percent,
		hedge_entry_price,
		hedge_funding_value,
		amm_realized_pnl,
		amm_last_price,
		amm_base,
		...cleanedAmmData
	} = !ammError && !ammLoading && ammPosition.data;
	const { hyperliquid_last_ticker, amm_current_price, ...cleanedHedgeData } =
		!hedgeError && !hedgeLoading && hedgePnl.data;
	const { hl_current_price, unrealized_pnl_by_entries, ...remaining } =
		cleanedHedgeData;

	const cleanedHedgeDataWithRenamedKey = {
		...remaining,
		current_price: hl_current_price, // renamed key
		unrealized_pnl: unrealized_pnl_by_entries,
	};
	console.log("checking cleaned data", cleanedAmmData);
	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getAllocationColor = (current: number, target: number) => {
		const diff = Math.abs(current - target);
		if (diff <= 1) return "text-green-600";
		if (diff <= 3) return "text-yellow-600";
		return "text-red-600";
	};

	const RenderObject = ({
		data,
		title,
	}: {
		data: Record<string, any>;
		title?: string;
	}) => {
		const formatValue = (value: any) => {
			console.log("checking values", value);

			const isNumericString =
				typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value);

			// Convert stringified number or number directly
			if (isNumericString || typeof value === "number") {
				const numStr = String(value);

				// If the string has more than 12 digits before decimal → assume it's a BigInt and divide
				const [wholePart] = numStr.split("."); // ignore decimals for digit count
				const needsDivision = wholePart.length > 12;

				const finalValue = needsDivision
					? Number(BigInt(wholePart) / BigInt(1e18))
					: Number(value);

				return finalValue.toFixed(2);
			}

			// If not number or numeric string, return as is
			return String(value);
		};

		// Separate flat and nested entries
		const entries = Object.entries(data);
		const flatEntries = entries.filter(
			([_, value]) => typeof value !== "object" || value === null
		);
		const nestedEntries = entries.filter(
			([_, value]) => typeof value === "object" && value !== null
		);

		return (
			<div className="space-y-6">
				{title && (
					<h2 className="text-lg font-semibold text-gray-700 capitalize">
						{title === "hyperliquid"
							? title + " " + "Current Positions"
							: title}
					</h2>
				)}

				{/* Flat values as rows */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
					{flatEntries.map(([key, value]) => (
						<>
							{key.toLowerCase().includes("id") || key === "id" ? null : (
								<>
									<Card
										key={key}
										className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4"
									>
										<div className="text-sm text-gray-600">{key}</div>
										<div className="text-base font-semibold text-gray-900">
											{key.toLowerCase().includes("timestamp") ||
											key === "created_at" ||
											key === "start_at" ||
											key === "end_at"
												? new Date(value).toLocaleString().split(",")[0]
												: formatValue(value)}
										</div>
									</Card>
								</>
							)}
						</>
					))}
				</div>

				{/* Nested sections row-wise */}
				{nestedEntries.map(([key, value]) => (
					<div key={key} className="border-t pt-4">
						<RenderObject data={value} title={key} />
					</div>
				))}
			</div>
		);
	};
	return (
		<div className="space-y-6">
			{/* <div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Hedging Summary</h1>
				<Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Select Platform" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="position">Position</SelectItem>
						<SelectItem value="reya">Reya</SelectItem>
						<SelectItem value="hyperliquid">Hyperliquid</SelectItem>
					</SelectContent>
				</Select>
			</div> */}
			{!ammError &&
			!inceptionError &&
			!hedgeError &&
			!ammLoading &&
			!inceptionLoading &&
			!hedgeLoading ? (
				<div className="">
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Summary
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
						<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
							<div className="text-sm text-gray-600">Total Realized PNL</div>
							<div className="text-base font-semibold text-gray-900">
								{!inceptionError &&
									!hedgeError &&
									!inceptionLoading &&
									!hedgeLoading &&
									(
										Number(inceptionPnl.data.realized_pnl) +
										Number(cleanedHedgeDataWithRenamedKey.realized_pnl_all_time)
									).toFixed(4)}
							</div>
						</Card>
						<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
							<div className="text-sm text-gray-600">Total Unrealized PNL</div>
							<div className="text-base font-semibold text-gray-900">
								{!inceptionError &&
									!hedgeError &&
									!inceptionLoading &&
									!hedgeLoading &&
									(
										Number(inceptionPnl.data.unrealized_pnl) +
										Number(cleanedHedgeDataWithRenamedKey.unrealized_pnl)
									).toFixed(4)}
							</div>
						</Card>
					</div>
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Current AMM Positions
					</h2>
					<RenderObject data={!ammLoading && cleanedAmmData} />
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Hedge PNL
					</h2>
					<RenderObject
						data={!hedgeLoading && cleanedHedgeDataWithRenamedKey}
					/>
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						AMM PNL Since Inception
					</h2>
					<RenderObject data={!inceptionLoading && inceptionPnl.data} />
				</div>
			) : (
				<div className="flex items-center justify-center">
					<Loader2 className="animate-spin mr-2" />
					Loading...
				</div>
			)}
		</div>
	);
}

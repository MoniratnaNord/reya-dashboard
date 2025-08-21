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
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "./ui/alert";
import { useMarketList } from "@/hooks/useMarketList";
import { useFeesQuery } from "@/hooks/useFeesQuery";

import { useHedgeData } from "@/hooks/useHedgeData";
import { useAmmData } from "@/hooks/useAmmData";

interface RebalanceData {
	platform: string;
	totalValue: number;
	rebalanceCount: number;
	lastRebalance: string;
	targetAllocation: { asset: string; percentage: number; current: number }[];
	performance: { period: string; return: number }[];
	status: "active" | "pending" | "completed";
}

export function RebalanceSummary({ selectedIndex }: { selectedIndex: number }) {
	const { signout } = useAuth();

	const {
		data: ammData,
		isLoading: ammDataLoading,
		isError: isAmmDataError,
		error: ammDataError,
		refetch: refetchAmmData,
	} = useAmmData(selectedIndex);
	const {
		data: hedgeData,
		isLoading: hedgeDataLoading,
		isError: isHedgeDataError,
		error: hedgeDataError,
		refetch: refetchHedgeData,
	} = useHedgeData(selectedIndex);

	if (isAmmDataError || isHedgeDataError) {
		if (
			(hedgeDataError !== null && (hedgeDataError as any).status === 401) ||
			(ammDataError !== null && (ammDataError as any).status === 401)
		) {
			window.alert("Session expired. Please log in again.");
			signout();
		}
	}
	useEffect(() => {
		refetchHedgeData();
		refetchAmmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIndex]);

	// cleaned inception data:
	// const { end_at, ...cleanedInceptionData } =
	// 	!inceptionError &&
	// 	!inceptionLoading &&
	// 	inceptionPnl.data !== null &&
	// 	inceptionPnl.data !== undefined &&
	// 	inceptionPnl.data;

	const RenderObject = ({
		data,
		title,
	}: {
		data: Record<string, any>;
		title?: string;
	}) => {
		const formatValue = (value: any) => {
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

				return finalValue.toFixed(4);
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
					{flatEntries.map(([key, value]) => (
						<>
							{key.toLowerCase().includes("id") || key === "id" ? null : (
								<>
									<Card
										key={key}
										className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4"
									>
										<div className="text-sm text-gray-600">{key}</div>
										<div className="text-sm font-semibold text-gray-900">
											{key.toLowerCase().includes("timestamp") ||
											key === "created_at" ||
											key === "start_at" ||
											key === "end_at"
												? new Date(value).toLocaleString()
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
			{!isAmmDataError &&
			!isHedgeDataError &&
			!ammDataLoading &&
			!hedgeDataLoading ? (
				<div className="">
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Summary
					</h2>
					{(ammData && ammData.data === null) || ammData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2 mt-10" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Total Realized PNL</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!hedgeDataError &&
										!ammDataLoading &&
										!hedgeDataLoading &&
										(
											Number(
												ammData.data.pnl_summary.since_inception.realized_pnl
											) +
											Number(hedgeData.data.pnl_summary.realized_pnl_all_time)
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Total Unrealized PNL
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										(
											Number(
												ammData.data.pnl_summary.since_inception.unrealized_pnl
											) +
											Number(
												hedgeData.data.pnl_summary.unrealized_pnl_by_entries
											)
										).toFixed(4)}
								</div>
							</Card>
							{/* <Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Total Investment Cap
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!marketError &&
										!marketLoading &&
										marketData.data[selectedIndex].reya.hedgeTotalInvestmentCap}
								</div>
							</Card> */}
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Total Fees Paid to HL
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataLoading &&
										hedgeData.data.hedge_fees_paid.since_inception.fees.toFixed(
											4
										)}
								</div>
							</Card>
						</div>
					)}
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						AMM Performance Overview
						<span className="text-sm text-gray-500">
							{" "}
							<br /> Start From:{" "}
							{new Date(
								ammData.data.pnl_summary.since_inception.start_at
							).toLocaleString()}
						</span>
					</h2>
					{ammData.data === null || ammData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							{/* <Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Start From</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammData &&
										!hedgeError &&
										!inceptionLoading &&
										!hedgeLoading &&
										(
											Number(inceptionPnl.data.realized_pnl) +
											Number(
												cleanedHedgeDataWithRenamedKey.realized_pnl_all_time
											)
										).toFixed(4)}
								</div>
							</Card> */}
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Realized PNL Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.since_inception.realized_pnl
										)
											// +
											// Number(
											// 	cleanedHedgeDataWithRenamedKey.realized_pnl_all_time
											// )
											.toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Realized PnL 7 Days</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.last_7_days.data.realized_pnl
										)
											//  +
											// Number(
											// 	cleanedHedgeDataWithRenamedKey.realized_pnl_all_time
											// )
											.toFixed(4)}
								</div>
							</Card>

							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Avg Entry Price Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(ammData.data.pnl_summary.since_inception.avg_price)
											// +
											// Number(cleanedHedgeDataWithRenamedKey.unrealized_pnl)
											.toFixed(4)}
								</div>
							</Card>

							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current AMM Position
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.since_inception.current_position
										)
											// +
											// Number(cleanedHedgeDataWithRenamedKey.unrealized_pnl)
											.toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current AMM Position (USD)
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.amm_base_in_usd
										).toFixed(4)}
								</div>
							</Card>

							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Initial Realised PnL Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.since_inception
												.since_inception_realized_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Initial Realised PnL 7 days
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.last_7_days.data
												.since_inception_realized_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current Realised PnL
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.since_inception
												.current_inception_realized_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current Unrealised PnL
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(
											ammData.data.pnl_summary.since_inception.unrealized_pnl
										).toFixed(4)}
								</div>
							</Card>

							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Total Unique Positions Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(ammData.data.position_counts.total_unique).toFixed(
											4
										)}
								</div>
							</Card>

							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Total Unique Positions 7 days
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!ammDataError &&
										!ammDataLoading &&
										Number(ammData.data.position_counts.last_7_days).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">AMM Current Price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.amm_current_price
										).toFixed(4)}
								</div>
							</Card>
						</div>
					)}

					{/* Start of Rebalance overview */}
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Rebalance Performance Overview
					</h2>
					{hedgeData.data === null || hedgeData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Entry Price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.rebalance_entry_price
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">PnL</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.rebalance_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">PnL Percentage</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.rebalance_pnl_percent
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Position Amount</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.rebalance_position_amt
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Position Amount(USD)
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade
												.rebalance_position_amt_usd
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Side</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										hedgeData.data.latest_hedge_trade.rebalance_position_side}
								</div>
							</Card>
						</div>
					)}
					{/* End of Rebalance overview */}

					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Hedge Performance Overview
					</h2>
					{hedgeData.data === null || hedgeData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Realized PnL Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.realized_pnl_all_time
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Realized PnL 7 days</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(hedgeData.data.pnl_summary.realized_pnl_7d).toFixed(
											4
										)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Unrealized PnL</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.unrealized_pnl_by_entries
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current Hedge Position
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.hedge_position_amt
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Current Hedge Position (USD)
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.hedge_position_amt_usd
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Volume Since Inception (USD)
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_total_volume_usd.since_inception
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Volume 7 days (USD)
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_total_volume_usd.last_7_days
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Position Count Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(hedgeData.data.hedge_position_counts.total).toFixed(
											4
										)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Position Count 7 days
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_position_counts.last_7_days
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Trade Count Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_fees_paid.since_inception
												.hedge_tx_count
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Hedge Trade Count 7 days
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_fees_paid.last_7_days.hedge_tx_count
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Fees paid Since Inception
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_fees_paid.since_inception.fees
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Fees paid 7 days</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.hedge_fees_paid.last_7_days.fees
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Avg Entry Price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.pnl_summary.hyperliquid_last_ticker
												.entry_price
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">HL Current Price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(hedgeData.data.pnl_summary.hl_current_price).toFixed(
											4
										)}
								</div>
							</Card>
						</div>
					)}
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Current AMM Positions
					</h2>
					{hedgeData.data === null || hedgeData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									amm_converted_last_price
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.amm_converted_last_price
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">market</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										hedgeData.data.latest_hedge_trade.market}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">amm_converted_base</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.amm_converted_base
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">amm_last_timestamp</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										new Date(
											hedgeData.data.latest_hedge_trade.amm_last_timestamp
										).toLocaleString()}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">hedge_margin_used</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hedge_margin_used
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">amm_base_in_usd</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.amm_base_in_usd
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">hedge_margin_pnl</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hedge_margin_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">hedge_position_amt</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hedge_position_amt
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									amm_converted_realized_pnl
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade
												.amm_converted_realized_pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">created_at</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										new Date(
											hedgeData.data.latest_hedge_trade.created_at
										).toLocaleString()}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">amm_current_price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.amm_current_price
										).toFixed(4)}
								</div>
							</Card>
						</div>
					)}

					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						hyperliquid Current Positions
					</h2>
					{hedgeData.data === null || hedgeData.data === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">pnl</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.pnl
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">position_amt</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.position_amt
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">position_amt_usd</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid
												.position_amt_usd
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">position</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										hedgeData.data.latest_hedge_trade.hyperliquid.position}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">pnl_percent</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.pnl_percent
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">entry_price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.entry_price
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">funding</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.funding
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">balance</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.balance
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">available_balance</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid
												.available_balance
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">total_margin_used</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid
												.total_margin_used
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">margin_used</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.margin_used
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">leverage</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid.leverage
										).toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">current_price</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(hedgeData.data.pnl_summary.hl_current_price).toFixed(
											4
										)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">total_notional</div>
								<div className="text-base font-semibold text-gray-900">
									{!hedgeDataError &&
										!hedgeDataLoading &&
										Number(
											hedgeData.data.latest_hedge_trade.hyperliquid
												.total_notional
										).toFixed(4)}
								</div>
							</Card>
						</div>
					)}
				</div>
			) : (ammDataError !== null && (ammDataError as any).status === 401) ||
			  (hedgeDataError !== null && (hedgeDataError as any).status === 401) ? (
				<div className="flex items-center justify-center">
					Session expired. Please login again.
				</div>
			) : (
				<div className="flex items-center justify-center">
					<Loader2 className="animate-spin mr-2" />
					Data not yet available.
				</div>
			)}
		</div>
	);
}

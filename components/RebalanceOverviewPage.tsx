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
import { useRebalancePosition } from "@/hooks/useRebalancePosition";
import { useRebalanceOverview } from "@/hooks/useRebalanceOverview";
import { TableComponent } from "./TableComponent";

interface RebalanceData {
	platform: string;
	totalValue: number;
	rebalanceCount: number;
	lastRebalance: string;
	targetAllocation: { asset: string; percentage: number; current: number }[];
	performance: { period: string; return: number }[];
	status: "active" | "pending" | "completed";
}

export function RebalanceOverviewPage() {
	const { signout } = useAuth();

	const {
		data: rebalanceData,
		isLoading: rebalanceLoading,
		isError: isRebalanceError,
		error: rebalanceError,
	} = useRebalanceOverview();

	// cleaned inception data:
	// const { end_at, ...cleanedInceptionData } =
	// 	!inceptionError &&
	// 	!inceptionLoading &&
	// 	inceptionPnl.data !== null &&
	// 	inceptionPnl.data !== undefined &&
	// 	inceptionPnl.data;

	return (
		<div className="space-y-6">
			{!isRebalanceError && !rebalanceLoading ? (
				<div className="">
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Summary
					</h2>
					{(rebalanceData && rebalanceData === null) ||
					rebalanceData === undefined ? (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin mr-2 mt-10" />
							Data not available yet.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Account Id</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceError && !rebalanceLoading && rebalanceData.id}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Name</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceError && !rebalanceLoading && rebalanceData.name}
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
								<div className="text-sm text-gray-600">Total Balance</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceLoading && rebalanceData.totalBalance.toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Live PnL</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceLoading && rebalanceData.livePnL.toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">Realized PnL</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceLoading && rebalanceData.realizedPnL.toFixed(4)}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Approaching Liquidation
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceLoading &&
										`${rebalanceData.isApproachingLiquidation}`}
								</div>
							</Card>
							<Card className="flex flex-row items-center justify-between bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 p-4">
								<div className="text-sm text-gray-600">
									Liquidation Imminent
								</div>
								<div className="text-base font-semibold text-gray-900">
									{!rebalanceLoading &&
										`${rebalanceData.isLiquidationImminent}`}
								</div>
							</Card>
						</div>
					)}

					{/* Start of Rebalance overview */}
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Rebalance positions
					</h2>
					<div>
						<TableComponent data={rebalanceData.positions} />
					</div>
					<h2 className="text-lg font-semibold text-gray-700 capitalize py-5">
						Collaterals
					</h2>
					<div>
						<TableComponent data={rebalanceData.collaterals} />
					</div>
					{/* {hedgeData.data === null || hedgeData.data === undefined ? (
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
					)} */}
					{/* End of Rebalance overview */}
				</div>
			) : rebalanceError !== null ? (
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

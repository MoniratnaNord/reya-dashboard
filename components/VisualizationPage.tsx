import { useAuth } from "@/contexts/AuthContext";
import { useAvgAmm } from "@/hooks/useAvgAmm";
import { useHedgingPosition } from "@/hooks/useHedgingPosition";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { useTradeSummary } from "@/hooks/useTradeSummary";
import React, { useEffect, useMemo, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart,
	Bar,
	AreaChart,
	Area,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
} from "recharts";

// NOTE: This component expects two backend endpoints (adjust to your backend):
// 1) /api/hedge_positions?since=<ISO>
//    -> returns array of HedgePosition rows with fields: created_at (ISO), amm_position_size, hedge_position_size, fill_size, avg_price, market_price, is_buy
// 2) /api/hyper_hedge_positions_history?since=<ISO>
//    -> returns array of HyperHedgePositionHistory rows with fields: created_at (ISO), position_size, fee, price, side

// Utility helpers
const isoAgo = (minutes: number) =>
	new Date(Date.now() - minutes * 60 * 1000).toISOString();
const toLocalTime = (iso: string) => {
	const d = new Date(iso);
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function prepareTimeseries(positions: any) {
	// Normalize and return sorted by created_at
	return positions
		.map((r: any) => ({
			time: r.buy_time,
			timeLabel: toLocalTime(r.created_at),
			amm: Number(r.amm_position_size || 0),
			hedge: Number(r.hedge_position_size || 0),
			fill_size: Number(r.fill_size || 0),
			fee: Number(r.fee || 0),
		}))
		.sort(
			(a: { time: string }, b: { time: string }) =>
				new Date(a.time).getTime() - new Date(b.time).getTime()
		);
}
function prepareTimeseriesForFee(positions: any) {
	// Normalize and return sorted by created_at
	return positions
		.map((r: any) => ({
			time: r.buy_time,
			timeLabel: toLocalTime(r.buy_time),
			amm: Number(r.amm_position_size || 0),
			hedge: Number(r.hedge_position_size || 0),
			fill_size: Number(r.fill_size || 0),
			fee: Number(r.fee || 0),
		}))
		.sort(
			(a: { time: string }, b: { time: string }) =>
				new Date(a.time).getTime() - new Date(b.time).getTime()
		);
}
interface VisualizationPageProps {
	initialWindowMinutes?: number;
	selectedIndex?: any; // Replace 'any' with a more specific type if possible
}

export default function VisualizationPage({
	initialWindowMinutes = 60,
	selectedIndex,
}: VisualizationPageProps) {
	const { signout } = useAuth();
	const [windowMinutes, setWindowMinutes] = useState(initialWindowMinutes);
	const [tradeHistoryMinutes, setTradeHistoryMinutes] =
		useState(initialWindowMinutes);
	const [hedgePositions, setHedgePositions] = useState<any[]>([]);
	const [orderPositions, setOrderPositions] = useState<any[]>([]);
	const [hyperHistory, setHyperHistory] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	console.log("selected index", selectedIndex);

	const {
		data: tradeHistory,
		isLoading: tradeLoading,
		error: tradeHistoryError,
	} = useTradeHistory(selectedIndex, tradeHistoryMinutes);
	const {
		data: orderHistory,
		isLoading: orderLoading,
		error: orderHistoryError,
	} = useOrderHistory(selectedIndex, tradeHistoryMinutes);
	const {
		data: tradeSummary,
		isLoading: tradeSummaryLoading,
		error: tradeSummaryError,
	} = useTradeSummary(selectedIndex, windowMinutes);
	const {
		data: avgAmmDataOne,
		isLoading: avgAmmOneLoading,
		error: avgAmmOneError,
	} = useAvgAmm(selectedIndex, 60);
	const {
		data: avgAmmDataTwo,
		isLoading: avgAmmTwoLoading,
		error: avgAmmTwoError,
	} = useAvgAmm(selectedIndex, 120);
	console.log("tradeHistory", tradeHistory);
	// const fetchData = async () => {
	// 	setLoading(true);
	// 	setError(null);
	// 	const since = isoAgo(windowMinutes);
	// 	try {

	// 		const [hpRes, hhRes] = await Promise.all([

	// 			fetch(
	// 				`/api/hyper_hedge_positions_history?since=${encodeURIComponent(
	// 					since
	// 				)}`
	// 			),
	// 		]);
	// 		if (!hpRes.ok || !hhRes.ok) {
	// 			throw new Error("One or more requests failed");
	// 		}
	// 		const hpJson = await hpRes.json();
	// 		const hhJson = await hhRes.json();
	// 		setHedgePositions(hpJson || []);
	// 		setHyperHistory(hhJson || []);
	// 	} catch (err) {
	// 		console.error(err);
	// 		setError(err.message || "Failed to load data");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	useEffect(() => {
		// fetchData();
		// optional: refresh every 30s
		// const id = setInterval(fetchData, 30_000);
		// return () => clearInterval(id);
		if (!tradeLoading && !orderLoading) {
			setHedgePositions(orderHistory.data);
			setOrderPositions(tradeHistory.data);
		}
	}, [tradeHistory, orderHistory]);

	// Derived metrics
	const timeseries = useMemo(
		() => prepareTimeseries(hedgePositions),
		[hedgePositions]
	);
	const timeseriesFee = useMemo(
		() => prepareTimeseriesForFee(orderPositions),
		[orderPositions]
	);

	const hedgeTradesCount = useMemo(
		() => hedgePositions.length,
		[hedgePositions]
	);

	console.log("tradeSummary", tradeSummary);
	const hedgingVolume = useMemo(
		() =>
			hedgePositions.reduce(
				(s, r) => s + (Number(r.hedge_position_size) || 0),
				0
			),
		[hedgePositions]
	);

	const ammChangesCount = useMemo(() => {
		let prev = null;
		let c = 0;
		const sorted = [...hedgePositions].sort(
			(a, b) => new Date(a.buy_time).getTime() - new Date(b.buy_time).getTime()
		);
		for (const r of sorted) {
			if (prev !== null) {
				if (Number(r.amm_position_size || 0) !== Number(prev)) c += 1;
			}
			prev = Number(r.amm_position_size || 0);
		}
		return c;
	}, [hedgePositions]);

	const avgAmm = useMemo(() => {
		if (!hedgePositions.length) return 0;
		return (
			hedgePositions.reduce(
				(s, r) => s + (Number(r.amm_position_size) || 0),
				0
			) / hedgePositions.length
		);
	}, [hedgePositions]);

	const avgHedge = useMemo(() => {
		if (!hedgePositions.length) return 0;
		return (
			hedgePositions.reduce(
				(s, r) => s + (Number(r.hedge_position_size) || 0),
				0
			) / hedgePositions.length
		);
	}, [hedgePositions]);

	// const avgSlippage = useMemo(
	// 	() => computeAvgSlippage(hedgePositions),
	// 	[hedgePositions]
	// );

	// Hyper history metrics
	const totalFees = useMemo(
		() => orderPositions.reduce((s, r) => s + (Number(r.fee) || 0), 0),
		[orderPositions]
	);
	const tradesCountHyper = useMemo(() => hyperHistory.length, [hyperHistory]);
	const totalHedgeSizeHyper = useMemo(
		() => hyperHistory.reduce((s, r) => s + (Number(r.position_size) || 0), 0),
		[hyperHistory]
	);
	const avgHedgeSize1h = useMemo(() => {
		if (!hyperHistory.length) return 0;
		return (
			hyperHistory.reduce((s, r) => s + (Number(r.position_size) || 0), 0) /
			hyperHistory.length
		);
	}, [hyperHistory]);

	// chart data: compress timeseries into 1 point per minute (or as-is)
	const chartData = useMemo(() => {
		// map to [{timeLabel, amm, hedge, fill_size}]
		return timeseries.map((d: any) => ({
			name: d.timeLabel,
			amm: d.amm,
			hedge: d.hedge,
			// fill: d.fill_size,
			fee: d.fee,
		}));
	}, [timeseries]);
	const chartDataFee = useMemo(() => {
		// map to [{timeLabel, amm, hedge, fill_size}]
		return timeseriesFee.map((d: any) => ({
			name: d.timeLabel,
			// fill: d.fill_size,
			fee: d.fee,
		}));
	}, [timeseriesFee]);
	useEffect(() => {
		if (
			(tradeSummaryError !== null &&
				(tradeSummaryError as any).status === 401) ||
			(tradeHistoryError !== null && (tradeHistoryError as any).status === 401)
		) {
			window.alert("Session expired. Please log in again.");
			signout();
		}
	}, [tradeSummaryError, tradeHistoryError]);
	return (
		<div className="p-4 min-h-screen bg-gray-50 text-sm">
			<div className="max-w-7xl mx-auto">
				<header className="mb-4">
					<h1 className="text-2xl font-semibold">AMM Hedging Monitoring</h1>
					<p className="text-gray-600">
						Window: last <strong>{windowMinutes}</strong> minutes
					</p>
					<div className="flex items-center gap-2 mt-2">
						{[
							{ label: "1hr", value: 60 },
							{ label: "1day", value: 1440 },
							{ label: "7day", value: 10080 },
						].map((option) => (
							<button
								key={option.value}
								type="button"
								className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
									windowMinutes === option.value
										? "bg-blue-600 text-white border-blue-700"
										: "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
								}`}
								onClick={() => setWindowMinutes(option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
				</header>
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
					<Panel title={`Total Hedge Size (${windowMinutes}m)`}>
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.total_hedge_size.toFixed(2)) ||
								0}
						</div>
						<div className="text-xs text-gray-600">
							Total hedge size for period (position_size)
						</div>
					</Panel>
					<Panel title={`Total Hedge Size USD (${windowMinutes}m)`}>
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.total_hedge_usd.toFixed(2)) ||
								0}
						</div>
						<div className="text-xs text-gray-600">
							Total hedge size for period (position_size)
						</div>
					</Panel>
					<Panel title={`Avg Hedge Size (${windowMinutes}m)`}>
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.avg_position_size.toFixed(2)) ||
								0}
						</div>
						<div className="text-xs text-gray-600">
							Avg hedge size for period (position_size)
						</div>
					</Panel>
					<Panel title={`Avg Hedge Size USD (${windowMinutes}m)`}>
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.avg_position_usd.toFixed(2)) ||
								0}
						</div>
						<div className="text-xs text-gray-600">
							Avg hedge size for period (position_size)
						</div>
					</Panel>
					<Panel title="Total Funding (USD)">
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.total_funding_usd.toFixed(2)) ||
								0}
						</div>
						{/* <div className="text-xs text-gray-600">
							Average hedge size for period (position_size)
						</div> */}
					</Panel>
					<Panel title="Total Funding (USD)">
						<div className="text-lg font-semibold">
							{(!tradeSummaryLoading &&
								tradeSummary &&
								tradeSummary.summary.order_stats.total_order_id_count) ||
								0}
						</div>
						{/* <div className="text-xs text-gray-600">
							Average hedge size for period (position_size)
						</div> */}
					</Panel>
				</section>
				<header className="mb-4">
					<h1 className="text-2xl font-semibold">Hedge History</h1>
					<p className="text-gray-600">
						Window: last <strong>{tradeHistoryMinutes}</strong> minutes
					</p>
					<div className="flex items-center gap-2 mt-2">
						{[
							{ label: "1hr", value: 60 },
							{ label: "1day", value: 1440 },
						].map((option) => (
							<button
								key={option.value}
								type="button"
								className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
									tradeHistoryMinutes === option.value
										? "bg-blue-600 text-white border-blue-700"
										: "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
								}`}
								onClick={() => setTradeHistoryMinutes(option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
				</header>
				<section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
					<Card
						title={`Hedge Trades (${tradeHistoryMinutes}m)`}
						value={hedgeTradesCount}
					/>
					<Card
						title={`Hedging Volume (${tradeHistoryMinutes}m)`}
						value={hedgingVolume.toFixed(2) || 0}
					/>

					<Card
						title={`Total Fees (${tradeHistoryMinutes}m)`}
						value={totalFees.toFixed(4)}
					/>
					<Card
						title={`Avg AMM (${60}m)`}
						value={(avgAmmDataOne && avgAmmDataOne.data.toFixed(2)) || 0}
					/>
					<Card
						title={`Avg AMM (${120}m)`}
						value={(avgAmmDataTwo && avgAmmDataTwo.data.toFixed(2)) || 0}
					/>
				</section>

				<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<Panel title="AMM Position vs Hedge Position">
						<ResponsiveContainer width="100%" height={320}>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="amm"
									stroke="#1f93ff"
									dot={false}
								/>
								<Line
									type="monotone"
									dataKey="hedge"
									stroke="#10b981"
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-2 text-xs text-gray-600">
							<div>
								AMM changes: <strong>{ammChangesCount}</strong>
							</div>
							<div>
								Avg AMM (window): <strong>{avgAmm.toFixed(2)}</strong>
							</div>
							<div>
								Avg Hedge (window): <strong>{avgHedge.toFixed(2)}</strong>
							</div>
						</div>
					</Panel>

					<Panel title="Hedging Volume Over Time">
						<ResponsiveContainer width="100%" height={320}>
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="hedge" fill="#2563eb" />
							</BarChart>
						</ResponsiveContainer>
					</Panel>
				</section>

				<section className="mb-8">
					<Panel title="Fees Timeline">
						<ResponsiveContainer width="100%" height={220}>
							<AreaChart data={chartDataFee}>
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Area
									type="monotone"
									dataKey="fee"
									stroke="#dc2626"
									fill="#fee2e2"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Panel>
				</section>

				<section>
					<Panel title="Raw Events (latest)">
						<div className="h-48 overflow-x-auto border rounded">
							<table className="w-full text-xs">
								<thead className="bg-gray-100">
									<tr>
										<th className="p-2 text-left">Time</th>
										<th className="p-2 text-right">AMM</th>
										<th className="p-2 text-right">Hedge</th>
										{/* <th className="p-2 text-right">Fill</th> */}
										<th className="p-2 text-right">Avg Price</th>
										{/* <th className="p-2 text-right">Market Price</th> */}
									</tr>
								</thead>
								<tbody>
									{timeseries
										.slice()
										.reverse()
										.map((r: any, i: any) => (
											<tr key={i} className="border-t">
												<td className="p-2">{r.timeLabel}</td>
												<td className="p-2 text-right">{r.amm.toFixed(2)}</td>
												<td className="p-2 text-right">{r.hedge.toFixed(2)}</td>
												{/* <td className="p-2 text-right">
													{r.fill_size.toFixed(2)}
												</td> */}
												<td className="p-2 text-right">
													{hedgePositions[hedgePositions.length - 1 - i]
														?.avg_price ?? "-"}
												</td>
												{/* <td className="p-2 text-right">
													{hedgePositions[hedgePositions.length - 1 - i]
														?.market_price ?? "-"}
												</td> */}
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</Panel>
				</section>

				<footer className="text-xs text-gray-500 mt-6">
					Last updated: {new Date().toLocaleString()}
				</footer>

				{error && <div className="mt-4 text-red-600">Error: {error}</div>}
				{loading && <div className="mt-4 text-gray-600">Loading...</div>}
			</div>
		</div>
	);
}

// Simple UI building blocks
function Card({ title, value }: any) {
	return (
		<div className="bg-white p-4 rounded shadow-sm">
			<div className="text-xs text-gray-500">{title}</div>
			<div className="text-2xl font-semibold mt-1">{value}</div>
		</div>
	);
}

function Panel({ title, children }: any) {
	return (
		<div className="bg-white p-4 rounded shadow-sm">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-medium">{title}</h3>
			</div>
			<div>{children}</div>
		</div>
	);
}

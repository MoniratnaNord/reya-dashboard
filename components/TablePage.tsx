"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { useHedgingPosition } from "@/hooks/useHedgingPosition";
import dayjs from "dayjs";

interface SalesData {
	id: string;
	customer: string;
	email: string;
	product: string;
	amount: number;
	status: "completed" | "pending" | "cancelled";
	date: string;
	category: string;
}

export function TablePage() {
	const { user, signout } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortField, setSortField] = useState<keyof SalesData>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;
	const { data, isLoading, isError, error } = useHedgingPosition(
		(currentPage - 1) * 10
	);
	if (isError && (error as any).status === 401) {
		signout();
	}

	const paginatedData = useMemo(() => {
		// const end = start + rowsPerPage;
		if (isLoading || !data.data) return [];
		if (data.data.length === 0) return [];
		return data.data.map(
			({
				amm_base,
				amm_realized_pnl,
				amm_last_price,
				bsc_funding_rate,
				market,
				id,
				exchange,
				...rest
			}: any) => {
				const formattedRest = { ...rest };

				if (formattedRest.reya_funding_rate !== undefined) {
					const val = formattedRest.reya_funding_rate;
					formattedRest.reya_funding_rate = Number(val).toFixed(4);
				}
				if (formattedRest.created_at !== undefined) {
					const val = formattedRest.created_at;
					formattedRest.created_at = new Date(val).toLocaleString();
				}
				return formattedRest;
			}
		);

		// return !isLoading && data.data;
	}, [data, isLoading]);

	const formattedData = paginatedData.map((item: any) => ({
		amm_position_size: item.amm_position_size,
		hedge_position_size: item.hedge_position_size,
		is_buy: item.is_buy,
		market_price: item.market_price,
		avg_price: item.avg_price,
		reya_funding_rate: item.reya_funding_rate,
		hl_funding_rate: item.hl_funding_rate,
		order_id: item.order_id,
		created_at: item.created_at,
	}));
	const handleSort = (field: keyof SalesData) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("desc");
		}
	};
	function formatDateTime(dateInput: string) {
		const date = new Date(dateInput);

		const pad = (n: any) => n.toString().padStart(2, "0");

		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1); // Months are zero-based
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		const seconds = pad(date.getSeconds());

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
	return (
		// <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
					<CardHeader>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<CardTitle className="text-lg font-semibold text-gray-900">
								Hedge Position
							</CardTitle>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										placeholder="Search customers..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 w-full sm:w-64"
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full sm:w-32">
										<Filter className="w-4 h-4 mr-2" />
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger className="w-full sm:w-36">
										<ChevronDown className="w-4 h-4 mr-2" />
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										<SelectItem value="Subscription">Subscription</SelectItem>
										<SelectItem value="Service">Service</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border overflow-hidden">
							<Table>
								<TableHeader className="bg-gray-50/50">
									{paginatedData.length === 0 ? null : (
										<TableRow>
											{!isLoading &&
												Object.keys(formattedData[0]).map((key) => (
													<TableHead
														key={key}
														className="cursor-pointer hover:bg-gray-100/50 transition-colors text-xs"
														onClick={() => handleSort("customer")}
													>
														<div className="flex items-center">
															{key}
															<ArrowUpDown className="ml-2 h-4 w-4" />
														</div>
													</TableHead>
												))}
										</TableRow>
									)}
								</TableHeader>
								{paginatedData.length === 0 ? null : (
									<TableBody>
										{!isLoading &&
											formattedData.map((item: any) => (
												<TableRow
													key={item.id}
													className="hover:bg-gray-50/50 transition-colors"
												>
													{Object.keys(formattedData[0]).map((key, index) => (
														<TableCell
															className="text-gray-600 text-xs"
															key={index}
														>
															{item[key] === true
																? "LONG"
																: item[key] === false
																? "SHORT"
																: item[key] === null
																? "null"
																: key === "created_at"
																? formatDateTime(item[key])
																: item[key]}
														</TableCell>
													))}
												</TableRow>
											))}
									</TableBody>
								)}
							</Table>
							{!isLoading && data.data.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									No results found. Try adjusting your filters.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
				<div className="flex justify-between items-center mt-4">
					<p className="text-sm text-gray-500">
						Page {currentPage} of{" "}
						{!isLoading && Math.ceil(data.row_count / rowsPerPage)}
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="px-3 py-1 text-sm border rounded disabled:opacity-50"
						>
							Previous
						</button>
						<button
							onClick={() => {
								setCurrentPage((p) =>
									Math.min(p + 1, Math.ceil(data.row_count / rowsPerPage))
								);
							}}
							disabled={
								currentPage ===
								(!isLoading && Math.ceil(data.row_count / rowsPerPage))
							}
							className="px-3 py-1 text-sm border rounded disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

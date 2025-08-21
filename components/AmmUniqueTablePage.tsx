"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useAmmUniquePosition } from "@/hooks/useAmmUniquePosition";

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

export function AmmUniqueTablePage({
	selectedIndex,
}: {
	selectedIndex: number;
}) {
	const { user, signout } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortField, setSortField] = useState<keyof SalesData>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10; // you can make this dynamic if needed
	const { data, isLoading, isError, error, refetch } = useAmmUniquePosition(
		selectedIndex,
		(currentPage - 1) * 10
	);
	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIndex]);
	if (isError && (error as any).status === 401) {
		signout();
	}
	const newPaginatedData = useMemo(() => {
		if (isLoading || !data.data) return [];
		if (data.data.length === 0) return [];
		return data.data.map(
			({ amm_base, amm_realized_pnl, amm_last_price, ...rest }: any) => {
				const formattedRest = { ...rest };
				if (
					formattedRest.created_at !== undefined ||
					formattedRest.amm_last_timestamp !== undefined
				) {
					const val = formattedRest.created_at;
					const timestamp = formattedRest.amm_last_timestamp;
					formattedRest.created_at = new Date(val).toLocaleString();
					formattedRest.amm_last_timestamp = new Date(
						timestamp
					).toLocaleString();
				}
				return formattedRest;
			}
		);
	}, [data, isLoading]);

	const handleSort = (field: keyof SalesData) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("desc");
		}
	};
	const formatValue = (value: any) => {
		if (value === null || value === undefined) return "—";

		// if it's boolean
		if (typeof value === "boolean") return value.toString();

		// if it's number
		if (typeof value === "number") return value.toFixed(4);

		// if it's a stringified number
		if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
			const num = Number(value);
			return isNaN(num) ? value : num.toFixed(4);
		}

		// if it's a big numeric string (likely BigInt)
		if (typeof value === "string" && /^\-?\d{13,}$/.test(value)) {
			try {
				const divided = BigInt(value) / BigInt(1e18);
				return Number(divided).toFixed(4);
			} catch (e) {
				return value;
			}
		}

		// fallback
		return value;
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
		<div className="max-w-6xl sm:max-w-xl md:max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
			<div className="max-w-6xl sm:max-w-xl md:max-w-xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
					<CardHeader>
						<div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4">
							<CardTitle className="text-lg font-semibold text-gray-900">
								Amm Position
							</CardTitle>
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="relative">
									Rows Count: {!isLoading && data.row_count}
								</div>
								<div>Limit: {!isLoading && data.limit}</div>
								<div>Limit Crossed: {!isLoading && data.limit_crossed}</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border overflow-x-auto w-full">
							<Table>
								<TableHeader className="bg-gray-50/50">
									{newPaginatedData.length === 0 ? null : (
										<TableRow>
											{!isLoading &&
												Object.keys(newPaginatedData[0]).map((key, index) => (
													<TableHead
														key={index}
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
								{newPaginatedData.length === 0 ? null : (
									<TableBody>
										{!isLoading &&
											newPaginatedData.map((item: any, index: any) => (
												<TableRow
													key={index}
													className="hover:bg-gray-50/50 transition-colors"
												>
													{Object.keys(newPaginatedData[0] || {}).map(
														(key, index) => (
															<TableCell
																className="text-gray-600 text-xs"
																key={index}
															>
																{formatValue(item[key])}
															</TableCell>
														)
													)}
												</TableRow>
											))}
									</TableBody>
								)}
							</Table>
							{!isLoading && data.data.length === 0 && (
								<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
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

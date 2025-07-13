"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
	LogOut,
	Search,
	Filter,
	Users,
	TrendingUp,
	DollarSign,
	ShoppingCart,
	ArrowUpDown,
	ChevronDown,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { RebalanceSummary } from "./RebalanceSummary";
import { MarketData } from "./MarketData";
import { TablePage } from "./TablePage";
import { AmmUniqueTablePage } from "./AmmUniqueTablePage";
import { useHedgePnl } from "@/hooks/useHedgePnl";
import { useMarketList } from "@/hooks/useMarketList";

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

const mockData: SalesData[] = [
	{
		id: "1",
		customer: "John Doe",
		email: "john@example.com",
		product: "Premium Plan",
		amount: 299,
		status: "completed",
		date: "2024-01-15",
		category: "Subscription",
	},
	{
		id: "2",
		customer: "Sarah Johnson",
		email: "sarah@example.com",
		product: "Basic Plan",
		amount: 99,
		status: "pending",
		date: "2024-01-14",
		category: "Subscription",
	},
	{
		id: "3",
		customer: "Mike Wilson",
		email: "mike@example.com",
		product: "Enterprise Plan",
		amount: 599,
		status: "completed",
		date: "2024-01-13",
		category: "Subscription",
	},
	{
		id: "4",
		customer: "Emily Brown",
		email: "emily@example.com",
		product: "Add-on Service",
		amount: 49,
		status: "completed",
		date: "2024-01-12",
		category: "Service",
	},
	{
		id: "5",
		customer: "David Lee",
		email: "david@example.com",
		product: "Premium Plan",
		amount: 299,
		status: "cancelled",
		date: "2024-01-11",
		category: "Subscription",
	},
	{
		id: "6",
		customer: "Lisa Garcia",
		email: "lisa@example.com",
		product: "Consulting",
		amount: 1200,
		status: "completed",
		date: "2024-01-10",
		category: "Service",
	},
];

export function Dashboard() {
	const { user, signout } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [sortField, setSortField] = useState<keyof SalesData>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const filteredAndSortedData = useMemo(() => {
		let filtered = mockData.filter((item) => {
			const matchesSearch =
				item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.product.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === "all" || item.status === statusFilter;
			const matchesCategory =
				categoryFilter === "all" || item.category === categoryFilter;

			return matchesSearch && matchesStatus && matchesCategory;
		});

		filtered.sort((a, b) => {
			let aVal = a[sortField];
			let bVal = b[sortField];

			if (sortField === "amount") {
				aVal = Number(aVal);
				bVal = Number(bVal);
			}

			if (sortOrder === "asc") {
				return aVal > bVal ? 1 : -1;
			} else {
				return aVal < bVal ? 1 : -1;
			}
		});

		return filtered;
	}, [searchTerm, statusFilter, categoryFilter, sortField, sortOrder]);

	const handleSort = (field: keyof SalesData) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("desc");
		}
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "completed":
				return "default";
			case "pending":
				return "secondary";
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	const totalRevenue = mockData.reduce(
		(sum, item) => (item.status === "completed" ? sum + item.amount : sum),
		0
	);
	const totalCustomers = new Set(mockData.map((item) => item.email)).size;
	const pendingOrders = mockData.filter(
		(item) => item.status === "pending"
	).length;
	const [activeTab, setActiveTab] = useState("hedging-summary");
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	const renderContent = () => {
		switch (activeTab) {
			case "hedging-summary":
				return <RebalanceSummary selectedIndex={selectedIndex} />;
			case "hedging-position":
				return <TablePage selectedIndex={selectedIndex} />;
			case "ammunique-position":
				return <AmmUniqueTablePage selectedIndex={selectedIndex} />;
			default:
				return <RebalanceSummary selectedIndex={selectedIndex} />;
		}
	};
	const [marketValue, setMarketValue] = useState<string[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [selectedPlatform, setSelectedPlatform] = useState<number | null>(0);
	const {
		data: marketData,
		isLoading: marketLoading,
		isError: marketError,
	} = useMarketList();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
			{/* Sidebar */}
			<Sidebar
				activeTab={activeTab}
				onTabChange={setActiveTab}
				isCollapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
			/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
					<div className="px-6 py-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<h1 className="text-xl font-bold text-gray-900">
									Trading Dashboard
								</h1>
							</div>
							<div className="flex items-center space-x-4">
								<span className="text-sm text-gray-600">Welcome</span>
								<Button
									onClick={signout}
									variant="outline"
									size="sm"
									className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
								>
									<LogOut className="w-4 h-4 mr-2" />
									Sign Out
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-bold text-gray-900">{}</h1>
							<Select
								value={
									selectedIndex !== null ? String(selectedIndex) : undefined
								}
								onValueChange={(value) => setSelectedIndex(Number(value))}
							>
								<SelectTrigger className="w-48">
									<SelectValue
										placeholder={
											selectedIndex !== null
												? marketData?.data[selectedIndex]?.reya?.market
												: "Select a platform"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{marketData?.data?.map((item: any, index: number) => (
										<SelectItem key={index} value={String(index)}>
											{item.reya.market}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</header>

				{/* Content Area */}
				<main className="flex-1 p-6">{renderContent()}</main>
			</div>
		</div>
	);
}

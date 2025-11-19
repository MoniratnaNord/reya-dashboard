"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	TrendingUp,
	Menu,
	TrendingUpDown,
	Table2Icon,
	Database,
} from "lucide-react";

interface SidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	isCollapsed: boolean;
	onToggle: () => void;
}

export function Sidebar({
	activeTab,
	onTabChange,
	isCollapsed,
	onToggle,
}: SidebarProps) {
	const menuItems = [
		{
			id: "visualization",
			label: "Visualization",
			icon: Database,
		},
		{
			id: "hedging-summary",
			label: "Hedging Summary",
			icon: BarChart3,
		},
		{
			id: "hedging-position",
			label: "Hedging Position",
			icon: TrendingUp,
		},
		{
			id: "ammunique-position",
			label: "Amm Position",
			icon: TrendingUpDown,
		},
		{
			id: "rebalance-position",
			label: "Rebalance Position",
			icon: Table2Icon,
		},
		{
			id: "rebalance-overview",
			label: "Rebalance Overview",
			icon: Database,
		},
	];

	return (
		<div
			className={cn(
				"bg-white/70 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 flex flex-col",
				isCollapsed ? "w-16" : "w-64"
			)}
		>
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					{!isCollapsed && (
						<div className="flex items-center">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3"></div>
							<h2 className="text-lg font-bold text-gray-900">Trading Hub</h2>
						</div>
					)}
					<button
						onClick={onToggle}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<Menu className="w-5 h-5 text-gray-600" />
					</button>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;

						return (
							<li key={item.id}>
								<button
									onClick={() => onTabChange(item.id)}
									className={cn(
										"w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 text-left",
										isActive
											? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									)}
								>
									<Icon
										className={cn(
											"w-5 h-5 flex-shrink-0",
											isCollapsed ? "mx-auto" : "mr-3"
										)}
									/>
									{!isCollapsed && (
										<span className="font-medium">{item.label}</span>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}

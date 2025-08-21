"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SigninForm } from "@/components/SigninForm";
import { Dashboard } from "@/components/Dashboard";
import { useHedgePnl } from "@/hooks/useHedgePnl";

function AppContent() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return user ? (
		<div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<Dashboard />
		</div>
	) : (
		<SigninForm />
	);
}

export default function Home() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

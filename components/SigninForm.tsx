"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Lock } from "lucide-react";

export function SigninForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { signin, isLoading } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const success = await signin(email, password);
		if (!success) {
			setError("Invalid email or password. Try admin@example.com / password");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
			<Card className="w-full max-w-md shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
				<CardHeader className="space-y-1 text-center">
					<div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
						<Lock className="w-8 h-8 text-white" />
					</div>
					<CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-gray-600">
						Sign in to access your dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="email"
									type="email"
									placeholder="admin@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-gray-700"
							>
								Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									type="password"
									placeholder="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>
						</div>
						{error && (
							<Alert className="border-red-200 bg-red-50">
								<AlertDescription className="text-red-700">
									{error}
								</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

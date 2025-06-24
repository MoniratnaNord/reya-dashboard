"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
	id: string;
	email: string;
	name: string;
	access_token: string;
}

interface AuthContextType {
	user: string | null;
	signin: (email: string, password: string) => Promise<boolean>;
	signout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for existing session on mount
		const savedUser = localStorage.getItem("access_token");
		if (savedUser) {
			setUser(savedUser);
		}
		setIsLoading(false);
	}, []);

	const signin = async (email: string, password: string) => {
		setIsLoading(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: email,
				password,
			}),
		});
		// Simple validation - in real app, this would be an API call
		if (res.status === 200) {
			const data = await res.json();
			// You may want to set user data here, e.g. setUser(data.user);
			// setUser(userData); // Uncomment and adjust if needed
			localStorage.setItem("access_token", data.access_token);
			setIsLoading(false);
			setUser(data.access_token);
			return true;
		}

		setIsLoading(false);
		return false;
	};

	const signout = () => {
		setUser("");
		localStorage.clear();
		localStorage.removeItem("accesss_token");
	};

	return (
		<AuthContext.Provider value={{ user, signin, signout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../supabase";

const Leaderboard = ({ isDaily = false, showToggle = false }) => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDailyMode, setIsDailyMode] = useState(isDaily);
	const [isMobile, setIsMobile] = useState(false);
	const [totalPlayers, setTotalPlayers] = useState(0);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);

		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	// Function to fetch total players count
	const fetchTotalPlayers = async (tableName) => {
		try {
			const { count, error } = await supabase
				.from(tableName)
				.select("*", { count: "exact", head: true });

			if (error) throw error;
			setTotalPlayers(count);
		} catch (err) {
			console.error("Error fetching player count:", err.message);
		}
	};

	useEffect(() => {
		let leaderboardChannel;
		const fetchAndSubscribe = async () => {
			try {
				// Choose the correct leaderboard table
				const tableName = isDailyMode ? "dailyLeaderboard" : "leaderboard";

				// Fetch initial leaderboard data
				const { data: leaderboardData, error } = await supabase
					.from(tableName)
					.select()
					.order("score", { ascending: false })
					.limit(10); // Top 10 players

				if (error) throw error;
				setLeaderboard(leaderboardData);

				// Fetch initial total players count
				await fetchTotalPlayers(tableName);

				// Realtime subscription
				leaderboardChannel = supabase
					.channel(tableName)
					.on(
						"postgres_changes",
						{ event: "*", schema: "public", table: tableName },
						async (payload) => {
							// Update leaderboard entries
							setLeaderboard((prevLeaderboard) => {
								let updatedLeaderboard = [...prevLeaderboard];
								if (payload.eventType === "INSERT" && payload.new) {
									updatedLeaderboard = [...updatedLeaderboard, payload.new];
									// Update the total count when a new entry is added
									fetchTotalPlayers(tableName);
								} else if (payload.eventType === "UPDATE" && payload.new) {
									updatedLeaderboard = updatedLeaderboard.map((entry) =>
										entry.id === payload.new.id ? payload.new : entry
									);
								} else if (payload.eventType === "DELETE" && payload.old) {
									updatedLeaderboard = updatedLeaderboard.filter(
										(entry) => entry.id !== payload.old.id
									);
									// Update the total count when an entry is deleted
									fetchTotalPlayers(tableName);
								}
								// Sort and limit to top 10
								updatedLeaderboard.sort((a, b) => b.score - a.score);
								return updatedLeaderboard.slice(0, 10);
							});
						}
					)
					.subscribe();
			} catch (error) {
				console.error("Error fetching leaderboard data:", error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndSubscribe();

		return () => {
			if (leaderboardChannel) {
				supabase.removeChannel(leaderboardChannel);
			}
		};
	}, [isDailyMode]);

	const toggleLeaderboard = () => {
		setIsDailyMode((prev) => !prev);
		setIsLoading(true);
	};

	return (
		<div className="max-w-3xl w-full mx-auto">
			<motion.div
				className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				{/* Header gradient bar */}
				<div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

				<div className="px-6 py-5 relative">
					<div className="flex justify-between items-center mb-6">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex items-center"
						>
							<span className="text-2xl mr-2">🏆</span>
							<h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
								{isDailyMode ? "Daily Challenge" : "Quick Play"}
							</h2>
						</motion.div>

						{showToggle && (
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={toggleLeaderboard}
								className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all"
								aria-label={
									isDailyMode
										? "Switch to Quick Play"
										: "Switch to Daily Challenge"
								}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
							</motion.button>
						)}
					</div>

					<AnimatePresence mode="wait">
						{isLoading ? (
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex justify-center items-center py-16"
							>
								<div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
							</motion.div>
						) : leaderboard.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.4 }}
								className="text-center py-12 px-4"
							>
								<div className="inline-flex rounded-full bg-blue-100 p-6 mb-4">
									<svg
										className="w-8 h-8 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-800">
									No Scores Yet
								</h3>
								<p className="mt-1 text-gray-500">
									Be the first to claim your place on the leaderboard!
								</p>
							</motion.div>
						) : (
							<motion.div
								key="leaderboard"
								initial="hidden"
								animate="visible"
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
										transition: { staggerChildren: 0.07 },
									},
								}}
								className="space-y-3"
							>
								{leaderboard.map((entry, index) => (
									<motion.div
										key={entry.id || index}
										variants={{
											hidden: { opacity: 0, y: 10 },
											visible: { opacity: 1, y: 0 },
										}}
										whileHover={{ scale: 1.02 }}
										className={`flex items-center p-3 rounded-lg ${
											index === 0
												? "bg-yellow-400 border border-yellow-500"
												: index === 1
												? "bg-gray-300 border border-gray-400"
												: index === 2
												? "bg-amber-600 border border-amber-700"
												: "bg-gray-100 border border-gray-200"
										} shadow-md`}
									>
										<div
											className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 shadow-md ${
												index === 0
													? "bg-yellow-600 text-white"
													: index === 1
													? "bg-gray-600 text-white"
													: index === 2
													? "bg-amber-800 text-white"
													: "bg-gray-400 text-white"
											} font-bold text-sm`}
										>
											{index === 0
												? "🥇"
												: index === 1
												? "🥈"
												: index === 2
												? "🥉"
												: index + 1}
										</div>
										<div className="ml-1 flex-1">
											<div
												className={`font-bold ${
													index === 0
														? "text-yellow-900"
														: index === 1
														? "text-gray-600"
														: index === 2
														? "text-amber-900"
														: "text-gray-600"
												}`}
											>
												{entry.name}
											</div>
										</div>
										<div
											className={`px-4 py-1 rounded-full shadow-md ${
												index === 0
													? "bg-yellow-600 text-white"
													: index === 1
													? "bg-gray-600 text-white"
													: index === 2
													? "bg-amber-800 text-white"
													: "bg-gray-500 text-white"
											} font-mono text-sm font-medium`}
										>
											{entry.score.toFixed(2)}
										</div>
									</motion.div>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					<div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
						<div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-md">
							Resets {isDailyMode ? "Daily" : "Weekly"}
						</div>
						<div className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full shadow-md">
							Total Submissions: {totalPlayers}
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default Leaderboard;

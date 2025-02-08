import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase from "../../supabase";

const Leaderboard = ({ isDaily = false, showToggle = false }) => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDailyMode, setIsDailyMode] = useState(isDaily);
	const [isMobile, setIsMobile] = useState(false);

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

				// Realtime subscription
				leaderboardChannel = supabase
					.channel(tableName)
					.on(
						"postgres_changes",
						{ event: "*", schema: "public", table: tableName },
						(payload) => {
							console.log("Payload received:", payload);
							setLeaderboard((prevLeaderboard) => {
								let updatedLeaderboard = [...prevLeaderboard];
								if (payload.eventType === "INSERT" && payload.new) {
									updatedLeaderboard = [...updatedLeaderboard, payload.new];
								} else if (payload.eventType === "UPDATE" && payload.new) {
									updatedLeaderboard = updatedLeaderboard.map((entry) =>
										entry.id === payload.new.id ? payload.new : entry
									);
								} else if (payload.eventType === "DELETE" && payload.old) {
									updatedLeaderboard = updatedLeaderboard.filter(
										(entry) => entry.id !== payload.old.id
									);
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

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	// Animation variants
	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
				ease: "easeOut",
			},
		},
	};

	const getBackgroundColor = (index) => {
		if (index === 0) return "bg-gradient-to-r from-orange-500 to-yellow-500";
		if (index === 1) return "bg-gradient-to-r from-gray-600 to-gray-400";
		if (index === 2) return "bg-gradient-to-r from-yellow-800 to-yellow-600";
		return "bg-n-6";
	};

	const getBadge = (index) => {
		if (index === 0) return "🥇";
		if (index === 1) return "🥈";
		if (index === 2) return "🥉";
		return null;
	};

	return (
		<div className="max-w-3xl mx-auto relative">
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="bg-n-5 text-white rounded-2xl shadow-lg p-6 pb-3 relative"
			>
				{/* Toggle Button */}
				{showToggle && (
					<button
						onClick={toggleLeaderboard}
						className="absolute top-4 right-4 p-2 bg-white text-black rounded-lg shadow-md font-semibold hover:bg-gray-200 transition"
					>
						🔄
					</button>
				)}
				<motion.h2
					className="text-2xl md:text-4xl font-extrabold text-center mb-6"
					variants={itemVariants}
				>
					🏆 {isDailyMode ? "Daily Challenge " : "Quick Play "}
				</motion.h2>
				{isLoading ? (
					<motion.div className="text-center text-n-2" variants={itemVariants}>
						Loading...
					</motion.div>
				) : leaderboard.length === 0 ? (
					<div className="space-y-4">
						<h2 className="text-center text-lg md:text-xl font-semibold text-n-2">
							No scores yet. Play to be the first!
						</h2>
						<ul className="space-y-2">
							{[...Array(3)].map((_, index) => (
								<li
									key={index}
									className={`flex items-center justify-between p-2 rounded-lg animate-pulse bg-n-4 transform transition-transform hover:scale-105`}
								>
									<div className="flex items-center space-x-3">
										<span className="w-6 h-8 flex items-center justify-center rounded-full font-bold text-xl bg-gray-300 text-transparent">
											{index + 1}
										</span>
										<span className="flex-grow ml-4 bg-gray-300 rounded-lg text-transparent h-4 w-24"></span>
									</div>
									<span className="w-16 bg-gray-300 rounded-lg text-transparent h-4"></span>
								</li>
							))}
						</ul>
					</div>
				) : (
					<motion.ul
						className="space-y-3"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{leaderboard.map((entry, index) => (
							<motion.li
								key={index}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 1.05 }}
								className={`flex items-center justify-between p-2 sm:pl-3 rounded-lg shadow-md ${getBackgroundColor(
									index
								)}`}
								variants={itemVariants}
							>
								<div className="flex items-center space-x-3 sm:space-x-6">
									<span className="w-6 h-8 flex items-center justify-center rounded-full font-bold text-xl">
										{getBadge(index) || index + 1}
									</span>
									<span className="text-lg font-semibold">{entry.name}</span>
								</div>
								<span className="text-lg font-semibold">
									{entry.score.toFixed(2)}
								</span>
							</motion.li>
						))}
					</motion.ul>
				)}
				<motion.p
					className="text-lg text-center text-n-2 mt-4 animate-pulse"
					variants={itemVariants}
				>
					Resets{isDailyMode ? " Daily" : " Weekly"}
				</motion.p>
			</motion.div>
		</div>
	);
};

export default Leaderboard;

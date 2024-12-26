import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase from "../../supabase";

const Leaderboard = () => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				// Fetch leaderboard data from Supabase
				const { data: leaderboardData, error: leaderboardError } =
					await supabase
						.from("leaderboard")
						.select()
						.order("score", { ascending: false })
						.limit(10); // Top 10 players

				if (leaderboardError) throw leaderboardError;
				setLeaderboard(leaderboardData);

				// Realtime subscription
				const leaderboardChannel = supabase
					.channel("leaderboard")
					.on(
						"postgres_changes",
						{ event: "INSERT", schema: "public", table: "leaderboard" },
						(payload) => {
							setLeaderboard((prevLeaderboard) => {
								const newLeaderboard = [...prevLeaderboard, payload.new];
								newLeaderboard.sort((a, b) => b.score - a.score);
								return newLeaderboard.slice(0, 10);
							});
						}
					)
					.on(
						"postgres_changes",
						{ event: "UPDATE", schema: "public", table: "leaderboard" },
						(payload) => {
							setLeaderboard((prevLeaderboard) => {
								const updatedLeaderboard = prevLeaderboard.map((entry) =>
									entry.id === payload.new.id ? payload.new : entry
								);
								updatedLeaderboard.sort((a, b) => b.score - a.score);
								return updatedLeaderboard.slice(0, 10);
							});
						}
					)
					.on(
						"postgres_changes",
						{ event: "DELETE", schema: "public", table: "leaderboard" },
						(payload) => {
							setLeaderboard((prevLeaderboard) =>
								prevLeaderboard.filter((entry) => entry.id !== payload.old.id)
							);
						}
					)
					.subscribe();

				// Cleanup subscription
				return () => {
					supabase.removeChannel(leaderboardChannel);
				};
			} catch (error) {
				console.error("Error fetching leaderboard data:", error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaderboard();
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<section className="bg-n-2 py-12">
			<div className="px-4 w-full max-w-4xl mx-auto">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
					className="bg-n-5 text-white rounded-2xl shadow-lg p-6"
				>
					<motion.h2
						className="text-4xl font-extrabold text-center mb-2"
						variants={itemVariants}
					>
						🏆 Leaderboard
					</motion.h2>
					<motion.p
						className="text-lg text-center text-gray-200 mb-4"
						variants={itemVariants}
					>
						Resets Weekly!
					</motion.p>
					{isLoading ? (
						<motion.div
							className="text-center text-gray-300"
							variants={itemVariants}
						>
							Loading...
						</motion.div>
					) : (
						<motion.ul
							className="space-y-3"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
						>
							{leaderboard.map((entry, index) => (
								<motion.li
									key={entry.id}
									className={`flex items-center justify-between p-3 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
										index === 0
											? "bg-yellow-500"
											: index === 1
											? "bg-gray-400"
											: index === 2
											? "bg-yellow-800"
											: "bg-n-6"
									}`}
									variants={itemVariants}
								>
									<div className="flex items-center space-x-3">
										<span className="text-lg font-bold w-8 text-center">
											{index + 1}
										</span>
										<span className="text-lg font-medium px-2">
											{entry.name}
										</span>
									</div>
									<span className="text-lg font-bold">
										{entry.score.toFixed(2)}
									</span>
								</motion.li>
							))}
						</motion.ul>
					)}
				</motion.div>
			</div>
		</section>
	);
};

export default Leaderboard;

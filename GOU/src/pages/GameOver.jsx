import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "react-use";
import Footer from "../components/Footer";
import supabase from "../../supabase";
import leoProfanity from "leo-profanity";
import ConfettiWrapper from "../components/ConfettiWrapper";
import Leaderboard from "../components/Leaderboard";
import GameOverPopup from "../components/GameOverPopup";
import { motion } from "framer-motion";

const GameOver = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isDaily, score, gameId } = location.state || {
		isDaily: false,
		score: 0,
		gameId: null,
	};
	const roundedScore = score.toFixed(2);

	const [leaderboard, setLeaderboard] = useState([]);
	const [name, setName] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isGameSubmitted, setIsGameSubmitted] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const { width, height } = useWindowSize();

	// Initialize profanity filter
	useEffect(() => {
		leoProfanity.loadDictionary();
	}, []);

	// Fetch leaderboard data from supabase and check for existing gameId submission
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				// Chose which leaderboard table to fetch
				const tableName = isDaily ? "dailyLeaderboard" : "leaderboard";

				// Fetch leaderboard data from supabase table
				const { data: leaderboardData, error: leaderboardError } =
					await supabase
						.from(tableName)
						.select()
						.order("score", { ascending: false })
						.limit(10);

				if (leaderboardError) throw leaderboardError;
				setLeaderboard(leaderboardData);

				// Check if the score for this gameId is already submitted
				if (gameId) {
					const { data: gameData, error: gameError } = await supabase
						.from(tableName)
						.select("gameId")
						.eq("gameId", gameId)
						.maybeSingle();

					if (gameError) throw gameError;
					if (gameData) setIsGameSubmitted(true);
				}
			} catch (error) {
				console.error("Error fetching leaderboard data:", error.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchLeaderboard();
	}, []);

	const handleNameChange = (e) => setName(e.target.value);

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Name cannot be empty");
			return;
		}

		// Check for name length
		const maxLength = 15;
		if (name.length > maxLength) {
			setError(`Name cannot exceed ${maxLength} characters`);
			return;
		}

		// Check for profanity in the name
		if (leoProfanity.check(name)) {
			setError("Please avoid profanity in your name");
			return;
		}

		try {
			// Chose which leaderboard table to insert into
			const tableName = isDaily ? "dailyLeaderboard" : "leaderboard";

			// Check if the score qualifies for the leaderboard
			if (
				leaderboard.length < 10 ||
				score > leaderboard[leaderboard.length - 1].score
			) {
				// Insert the new score with gameId
				const { data, error } = await supabase
					.from(tableName)
					.insert([{ name, score, gameId }]);
				if (error) throw error;

				setIsSubmitted(true);
			} else {
				setError("Your score did not make the top 10");
			}
		} catch (error) {
			console.error("Error submitting score:", error.message);
			setError("Failed to submit your score. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
			{/* Decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-purple-100/30 to-pink-200/30 rounded-full blur-3xl"></div>
			</div>

			{/* Confetti - now with z-index higher than leaderboard */}
			{!isLoading &&
				!isSubmitted &&
				!isGameSubmitted &&
				(leaderboard.length < 10 ||
					score > leaderboard[leaderboard.length - 1]?.score) &&
				score !== 0 && <ConfettiWrapper width={width} height={height} />}

			{/* Popup */}
			{!isLoading &&
				!isSubmitted &&
				!isGameSubmitted &&
				(leaderboard.length < 10 ||
					score > leaderboard[leaderboard.length - 1]?.score) &&
				score !== 0 && (
					<GameOverPopup
						score={roundedScore}
						onSubmit={handleSubmit}
						onDismiss={() => setIsGameSubmitted(true)}
						name={name}
						onNameChange={handleNameChange}
						error={error}
					/>
				)}

			{/* Main Content - ensure z-index is below confetti */}
			<div className="flex-grow flex flex-col justify-center items-center px-6 py-12 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-6"
				>
					<h1 className="text-5xl sm:text-6xl font-extrabold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">
						Game Over
					</h1>
					<p className="text-lg text-gray-600">Thank you for playing!</p>
				</motion.div>

				{/* Score Card with Buttons */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="bg-white rounded-2xl shadow-lg mb-10 overflow-hidden w-full max-w-md border border-gray-100"
				>
					{/* Card Header */}
					<div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
						<h2 className="text-xl font-semibold text-center">Final Results</h2>
					</div>

					{/* Card Content */}
					<div className="p-6">
						<div className="flex justify-center items-center mb-6">
							<div className="text-center">
								<p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">
									Your Score
								</p>
								<div className="flex items-baseline justify-center">
									<span className="text-4xl font-bold text-blue-600">
										{roundedScore}
									</span>
									<span className="text-lg text-gray-400 ml-1">/ 500</span>
								</div>
							</div>
						</div>

						<div className="mb-6">
							<div className="w-full bg-gray-200 rounded-full h-3 mb-4">
								<div
									className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
									style={{ width: `${Math.min((score / 500) * 100, 100)}%` }}
								></div>
							</div>
						</div>

						{/* Buttons section with conditional styling based on game type */}
						{isDaily ? (
							// Centered Home button for Daily Play
							<div className="flex justify-center">
								<button
									onClick={() => navigate("/")}
									className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
								>
									Home
								</button>
							</div>
						) : (
							// Left-right aligned buttons for Regular Play
							<div className="flex justify-between">
								<button
									onClick={() => navigate("/")}
									className="px-8 py-3 ml-2 bg-blue-500 text-white rounded-lg shadow-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
								>
									Home
								</button>
								<button
									onClick={() => navigate("/quick-play")}
									className="px-8 py-3 mr-2 bg-green-500 text-white rounded-lg shadow-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
								>
									Play Again
								</button>
							</div>
						)}
					</div>
				</motion.div>

				{/* Leaderboard */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="w-full max-w-3xl"
				>
					<Leaderboard isDaily={isDaily} />
				</motion.div>
			</div>

			{/* Footer */}
			<div className="relative z-10">
				<Footer />
			</div>
		</div>
	);
};

export default GameOver;

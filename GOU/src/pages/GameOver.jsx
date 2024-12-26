import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "react-use";
import Footer from "../components/Footer";
import supabase from "../../supabase";
import leoProfanity from "leo-profanity";
import ConfettiWrapper from "../components/ConfettiWrapper";

const GameOver = () => {
	const navigate = useNavigate(); // Navigate to different pages
	const location = useLocation(); // Access the current location and its state
	const { score, gameId } = location.state || { score: 0, gameId: null }; // Get score and gameId from location state
	const roundedScore = score.toFixed(2);

	const [leaderboard, setLeaderboard] = useState([]);
	const [name, setName] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isGameSubmitted, setIsGameSubmitted] = useState(false); // Track if the game is already submitted
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const { width, height } = useWindowSize(); // Get the window size for confetti

	// Initialize profanity filter
	useEffect(() => {
		leoProfanity.loadDictionary(); // Load default dictionary
	}, []);

	// Fetch leaderboard data from supabase and check for existing gameId submission
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				// Fetch leaderboard data
				const { data: leaderboardData, error: leaderboardError } =
					await supabase
						.from("leaderboard")
						.select()
						.order("score", { ascending: false }) // Sort by score descending
						.limit(10); // Limit to 10 results

				if (leaderboardError) throw leaderboardError;
				setLeaderboard(leaderboardData);

				// Check if the score for this gameId is already submitted
				if (gameId) {
					const { data: gameData, error: gameError } = await supabase
						.from("leaderboard")
						.select("gameId")
						.eq("gameId", gameId)
						.maybeSingle(); // Returns null if no data found

					if (gameError) throw gameError;
					if (gameData) setIsGameSubmitted(true); // Set the flag if gameId is found meaning the game is already submitted in database
				}
			} catch (error) {
				console.error("Error fetching leaderboard data:", error.message);
			} finally {
				setIsLoading(false); // Set loading to false once data is fetched
			}
		};
		fetchLeaderboard();

		// Setup realtime subscription using the new channel API in Supabase 2.x
		const leaderboardChannel = supabase
			.channel("leaderboard") // Create a channel for the leaderboard
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "leaderboard" },
				(payload) => {
					setLeaderboard((prevLeaderboard) => {
						const newLeaderboard = [...prevLeaderboard, payload.new];
						newLeaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
						return newLeaderboard.slice(0, 10); // Limit to 10 results
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
						updatedLeaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
						return updatedLeaderboard.slice(0, 10); // Limit to 10 results
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
			.subscribe(); // Subscribe to the events

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(leaderboardChannel); // Remove the channel on component unmount
		};
	}, []); // Empty array ensures this runs only once on mount

	const handleNameChange = (e) => setName(e.target.value); // Update the name state on input change

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Name cannot be empty");
			return;
		}

		// Check for profanity in the name
		if (leoProfanity.check(name)) {
			setError("Please avoid profanity in your name");
			return;
		}

		try {
			// Check if the score qualifies for the leaderboard
			if (
				leaderboard.length < 10 ||
				score > leaderboard[leaderboard.length - 1].score
			) {
				// Insert the new score with gameId
				const { data, error } = await supabase
					.from("leaderboard")
					.insert([{ name, score, gameId }]);
				if (error) throw error;

				setIsSubmitted(true);

				// Fetch updated leaderboard
				const { data: updatedLeaderboard, error: fetchError } = await supabase
					.from("leaderboard")
					.select()
					.order("score", { ascending: false })
					.limit(10);

				if (fetchError) throw fetchError;

				setLeaderboard(updatedLeaderboard);
			} else {
				setError("Your score did not make the top 10");
			}
		} catch (error) {
			console.error("Error submitting score:", error.message);
			setError("Failed to submit your score. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-between bg-n-2">
			{/* Confetti Effect */}
			{!isLoading &&
				!isSubmitted &&
				!isGameSubmitted &&
				(leaderboard.length < 10 ||
					score > leaderboard[leaderboard.length - 1]?.score) &&
				score !== 0 && (
					<ConfettiWrapper width={width} height={height} />
				)}

			{/* Modal for Score Submission */}
			{!isLoading &&
				!isSubmitted &&
				!isGameSubmitted &&
				(leaderboard.length < 10 ||
					score > leaderboard[leaderboard.length - 1]?.score) &&
				score !== 0 && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
							<h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
								🎉 Congratulations!
							</h2>
							<p className="text-center font-semibold text-gray-800 mb-4">
								Your score is in the top 10! Submit your name to secure your
								spot on the leaderboard.
							</p>
							<div className="flex flex-col space-y-4">
								<input
									type="text"
									placeholder="Enter your name"
									value={name}
									onChange={handleNameChange}
									className="p-3 border rounded w-full"
								/>
								<button
									onClick={handleSubmit}
									className="w-full py-2 bg-n-5 text-white rounded hover:bg-blue-600"
								>
									Submit Score
								</button>
								<button
									onClick={() => setIsGameSubmitted(true)} // Simulate dismiss action
									className="w-full py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
								>
									No Thanks
								</button>
							</div>
							{error && (
								<p className="text-red-500 mt-2 text-center">{error}</p>
							)}
						</div>
					</div>
				)}

			{/* Main Content */}
			<div className="flex-grow flex flex-col justify-center items-center px-4 py-6">
				<h1 className="text-4xl font-bold mb-2 text-center">Game Over!</h1>
				<p className="text-lg mb-1 text-center">Thank you for playing!</p>
				<p className="text-xl font-semibold mb-6 text-center">
					Final Score: {roundedScore} / 500
				</p>

				{/* Buttons */}
				<div className="flex flex-wrap justify-center items-center mt-2 space-x-8">
					<button
						onClick={() => navigate("/")}
						className="w-48 px-6 py-2 bg-n-6 text-white text-xl font-semibold rounded-md hover:bg-n-5"
					>
						Home
					</button>
					<button
						onClick={() => navigate("/play")}
						className="w-48 px-6 py-2 bg-n-6 text-white text-xl font-semibold rounded-md hover:bg-n-5"
					>
						Play Again
					</button>
				</div>

				{/* Leaderboard */}
				<div className="bg-n-2 px-4 py-4 w-full max-w-4xl">
					<div className="bg-n-5 text-white rounded-2xl shadow-lg p-6">
						<h2 className="text-4xl font-extrabold text-center mb-2">
							🏆 Leaderboard
						</h2>
						<p className="text-lg text-center text-gray-200 mb-4">
							Resets Weekly!
						</p>
						<ul className="space-y-3">
							{leaderboard.map((entry, index) =>
								entry && entry.name ? (
									<li
										key={index}
										className={`flex items-center justify-between p-3 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
											index === 0
												? "bg-yellow-500"
												: index === 1
												? "bg-gray-400"
												: index === 2
												? "bg-yellow-800"
												: "bg-n-6"
										}`}
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
									</li>
								) : null
							)}
						</ul>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default GameOver;

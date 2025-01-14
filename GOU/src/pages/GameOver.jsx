import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "react-use";
import Footer from "../components/Footer";
import supabase from "../../supabase";
import leoProfanity from "leo-profanity";
import ConfettiWrapper from "../components/ConfettiWrapper";
import Leaderboard from "../components/Leaderboard";
import GameOverPopup from "../components/GameOverPopup";

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
				setIsLoading(false); // Set loading to false once gameId has been checked
			}
		};
		fetchLeaderboard();
	}, []); // Empty array ensures this runs only once on mount

	const handleNameChange = (e) => setName(e.target.value); // Update the name state on input change

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

				setIsSubmitted(true); // Set the submission flag
			} else {
				setError("Your score did not make the top 10");
			}
		} catch (error) {
			console.error("Error submitting score:", error.message);
			setError("Failed to submit your score. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
			{/* Confetti */}
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

			{/* Main Content */}
			<div className="flex-grow flex flex-col justify-center items-center px-6 py-12">
				<h1 className="text-5xl font-extrabold mb-4 text-center text-gray-800">
					Game Over!
				</h1>
				<p className="text-lg text-gray-700 mb-2 text-center">
					Thank you for playing!
				</p>
				<p className="text-2xl font-bold text-n-6 mb-8 text-center">
					Final Score: {roundedScore} / 500
				</p>

				{/* Buttons */}
				<div className="flex space-x-4">
					<button
						onClick={() => navigate("/")}
						className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
					>
						Home
					</button>
					<button
						onClick={() => navigate("/quick-play")}
						className="px-8 py-3 bg-green-500 text-white rounded-lg shadow-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
					>
						Play Again
					</button>
				</div>

				{/* Leaderboard */}
				<div className="p-6 w-full max-w-3xl">
					<Leaderboard score={score} gameId={gameId} />
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default GameOver;

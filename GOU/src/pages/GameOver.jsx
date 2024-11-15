import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import supabase from "../../supabase";

const GameOver = () => {
	const navigate = useNavigate(); // Navigate to different pages
	const location = useLocation(); // Access the current location and its state
	const { score } = location.state || { score: 0 }; // Get score from location or set to 0 if not available
	const roundedScore = score.toFixed(2);

	const [leaderboard, setLeaderboard] = useState([]);
	const [name, setName] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");

	// Fetch leaderboard data from supabase
	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const { data, error } = await supabase
					.from("leaderboard")
					.select()
					.order("score", { ascending: false }) // Sort by score descending
					.limit(10); // Limit to 10 results

				if (error) throw error;
				setLeaderboard(data);
			} catch (error) {
				console.error("Error fetching leaderboard data:", error.message);
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

		if (
			leaderboard.length < 10 ||
			score > leaderboard[leaderboard.length - 1].score
		) {
			try {
				const { data, error } = await supabase
					.from("leaderboard")
					.insert([{ name, score }]); // Insert the new score

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
			} catch (error) {
				console.error("Error submitting score:", error.message);
			}
		} else {
			setError("Your score did not make the top 10 leaderboard");
		}
	};

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center bg-blue-100">
				<h1 className="text-4xl font-bold mb-4">Game Over!</h1>
				<p className="text-lg">Thank you for playing!</p>
				<p className="text-xl">Final Score: {roundedScore} / 500</p>

				{/* Leaderboard */}
				<div className="bg-white px-4 pb-4 rounded-lg m-6 border shadow-md min-w-72">
					<h2 className="text-xl font-bold underline mt-4 text-center">
						Leaderboard
					</h2>
					<p className="text-center">Resets Daily!</p>
					<ul className="mt-2 text-center">
						{leaderboard.map((entry, index) =>
							entry && entry.name ? (
								<li key={index} className="text-lg">
									{index + 1}. {entry.name}: {entry.score.toFixed(2)}
								</li>
							) : null
						)}
					</ul>

					{/* Submit score form if score is in the top 10 */}
					{!isSubmitted &&
						(leaderboard.length < 10 ||
							score > leaderboard[leaderboard.length - 1]?.score) &&
						score !== 0 && (
							<div className="mt-6">
								<h2 className="text-lg font-bold text-center">
									You've made the top 10!
								</h2>
								<p className="text-md mb-4 text-center">
									Submit below to be a part of the leaderboard!
								</p>
								<input
									type="text"
									placeholder="Enter your name"
									value={name}
									onChange={handleNameChange}
									className="p-2 border rounded"
								/>
								<button
									onClick={handleSubmit}
									className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Submit Score
								</button>
								{error && <p className="text-red-500 mt-2">{error}</p>}
							</div>
						)}

					{/* Confirmation message after submission */}
					{isSubmitted && (
						<p className="mt-4 text-green-500">
							Thank you for submitting your score!
						</p>
					)}
				</div>

				<div className="flex flex-row items-center">
					<button
						onClick={() => navigate("/")} // Navigate to / on button press
						className="mr-2 w-32 mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Home
					</button>
					<button
						onClick={() => navigate("/play")} // Navigate to /play on button press
						className="ml-2 w-32 mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Play Again
					</button>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default GameOver;

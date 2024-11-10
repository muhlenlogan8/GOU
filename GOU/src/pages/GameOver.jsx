import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const GameOver = () => {
	const navigate = useNavigate(); // Initialize the useNavigate hook
	const location = useLocation(); // Initialize the useLocation hook
	const { score } = location.state || { score: 0 };
	const roundedScore = score.toFixed(2);

	const [leaderboard, setLeaderboard] = useState([]);
	const [isTop10, setIsTop10] = useState(false);
	const [name, setName] = useState("");

	useEffect(() => {
		// Fetch the leaderboard data
		fetch("/api/leaderboard")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setLeaderboard(data);
				// Check if the score is in the top 10
				const isTop10 = data.length < 10 || score > data[data.length - 1].score;
				setIsTop10(isTop10);
			})
			.catch((error) => {
				console.error("Error fetching leaderboard data:", error);
			});
	}, [score]);

	const handleNameSubmit = () => {
		const newEntry = { name, score: parseFloat(roundedScore) };

		// Send the new entry to the backend to update the leaderboard
		fetch("/api/leaderboard", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newEntry),
		})
			.then((response) => response.json())
			.then((data) => {
				setLeaderboard(data);
				setIsTop10(false); // Hide the prompt after submission
			})
			.catch((error) => {
				console.error("Error updating leaderboard:", error);
			});
	};

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center bg-gray-200">
				<h1 className="text-4xl font-bold mb-4">Game Over!</h1>
				<p className="text-lg">Thank you for playing!</p>
				<p className="text-xl">Final Score: {roundedScore} / 500</p>
				<button
					onClick={() => navigate("/play")} // Navigate to /play on button press
					className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Play Again
				</button>
				{isTop10 && (
					<div className="mt-8 flex flex-col items-center">
						<h3 className="text-xl text-center font-bold">
							Congratulations! You made it to the top 10!
						</h3>
						<p className="mt-2 text-center">
							Please enter your name for the leaderboard:
						</p>
						<div className="flex flex-col items-center">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="mt-2 px-4 py-2 border border-gray-300 rounded"
							/>
							<button
								onClick={handleNameSubmit}
								className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								Submit
							</button>
						</div>
					</div>
				)}
				<h2 className="text-2xl font-bold mt-8">Leaderboard</h2>
				{leaderboard.length > 0 ? (
					<table className="mt-4 border-collapse border border-gray-400">
						<thead>
							<tr>
								<th className="border border-gray-300 px-4 py-2">Rank</th>
								<th className="border border-gray-300 px-4 py-2">Name</th>
								<th className="border border-gray-300 px-4 py-2">Score</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard.map((entry, index) => (
								<tr key={index}>
									<td className="border border-gray-300 px-4 py-2">
										{index + 1}
									</td>
									<td className="border border-gray-300 px-4 py-2">
										{entry.name}
									</td>
									<td className="border border-gray-300 px-4 py-2">
										{entry.score.toFixed(2)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p className="mt-4">The leaderboard is currently empty.</p>
				)}
			</div>
			<Footer />
		</>
	);
};

export default GameOver;

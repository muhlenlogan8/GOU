import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const GameOver = () => {
	const navigate = useNavigate(); // Navigate to different pages
	const location = useLocation(); // Access the current location and its state
	const { score } = location.state || { score: 0 }; // Get score from location or set to 0 if not available
	const roundedScore = score.toFixed(2);

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center bg-gray-200">
				<h1 className="text-4xl font-bold mb-4">Game Over!</h1>
				<p className="text-lg">Thank you for playing!</p>
				<p className="text-xl">Final Score: {roundedScore} / 500</p>
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

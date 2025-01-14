import React, { useState } from "react";

const ResultsPopup = ({
	distance,
	score,
	round,
	totalRounds,
	onClose,
	isGameOver,
	onReport, // New prop for reporting issues
}) => {
	const [hasReported, setHasReported] = useState(false); // Track if image has been reported by user

	// Function to handle reporting an issue with the image
	const handleReportClick = () => {
		setHasReported(true); // Set hasReported to true
		onReport(); // Call onReport function passed as prop
	};

	return (
		<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
			<div
				className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl w-11/12 max-w-md animate-fadeIn"
				style={{
					background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
					border: "1px solid #ddd",
				}}
			>
				<h2 className="text-3xl font-extrabold mb-3 sm:mb-6 text-center text-black">
					{isGameOver ? "Game Over!" : "Round Results"}
				</h2>

				<div className="flex flex-col items-center space-y-2 sm:space-y-4">
					<div className="text-lg font-medium">
						<span className="text-n-6">Distance:</span>{" "}
						<span className="text-blue-500">
							{distance?.toFixed(2) || "N/A"}m
						</span>
					</div>
					<div className="text-lg font-medium">
						<span className="text-n-6">Points:</span>{" "}
						<span className="text-green-600 font-bold">{score}</span>
					</div>
					<div className="text-sm text-n-6">
						Round {round} of {totalRounds}
					</div>
				</div>

				{/* Divider */}
				<div className="my-3 sm:my-6 border-t border-gray-300"></div>

				{/* Button */}
				<div className="flex flex-col items-center space-y-3">
					<button
						onClick={onClose}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
					>
						{isGameOver ? "See Final Score" : "Next Round"}
					</button>

					{/* Report Issue Button */}
					{hasReported ? (
						<p className="text-sm text-green-600 font-semibold animate-pulse">
							The image has been reported. Thank you!
						</p>
					) : (
						<button
							onClick={handleReportClick}
							className="text-xs sm:text-sm text-red-500 hover:underline focus:outline-none pt-2"
						>
							Problem with this image or its coordinates? Click here!
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResultsPopup;

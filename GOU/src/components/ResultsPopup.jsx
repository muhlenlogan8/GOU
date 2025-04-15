import React, { useState } from "react";
import ReportImagePopup from "./subcomponents/ReportImagePopup";

const ResultsPopup = ({
	distance,
	score,
	round,
	totalRounds,
	onClose,
	isGameOver,
	gameId,
	imageName,
}) => {
	const [hasReported, setHasReported] = useState(false);
	const [isFeedbackPopupVisible, setIsFeedbackPopupVisible] = useState(false);

	const handleReportClick = () => {
		setIsFeedbackPopupVisible(true);
	};

	// Updated to accept a parameter indicating if a report was submitted
	const handleFeedbackPopupClose = (wasReportSubmitted = false) => {
		setIsFeedbackPopupVisible(false);
		if (wasReportSubmitted) {
			setHasReported(true); // Only mark as reported if report was actually submitted
		}
	};

	return (
		<>
			{/* Report Image Popup */}
			{isFeedbackPopupVisible && (
				<ReportImagePopup
					isVisible={isFeedbackPopupVisible}
					onClose={handleFeedbackPopupClose}
					imageTitle={imageName || `Image for round ${round}`}
					gameId={gameId}
				/>
			)}

			{/* Main Results Popup */}
			<div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 p-4">
				<div
					className="bg-white rounded-2xl w-11/12 max-w-md animate-fadeIn overflow-hidden"
					style={{
						background: "linear-gradient(145deg, #f8faff, #f0f4fa)",
					}}
				>
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
						<h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
							{isGameOver ? "Game Over!" : "Round Results"}
						</h2>
					</div>

					<div className="p-4 sm:p-6">
						{/* Stats cards */}
						<div className="grid grid-cols-2 gap-3 mb-4 sm:mb-5">
							<div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-100 shadow-sm">
								<div className="text-sm text-blue-800 font-medium mb-1">
									Distance
								</div>
								<div className="text-xl sm:text-2xl font-bold text-blue-600">
									{distance?.toFixed(2) || "N/A"}m
								</div>
							</div>
							<div className="bg-green-50 p-3 rounded-xl text-center border border-green-100 shadow-sm">
								<div className="text-sm text-green-800 font-medium mb-1">
									Points
								</div>
								<div className="text-xl sm:text-2xl font-bold text-green-600">
									{score}
								</div>
							</div>
						</div>

						{/* Progress indicator */}
						<div className="mb-5">
							<div className="flex justify-between text-sm text-gray-600 font-medium mb-1">
								<span>Progress</span>
								<span>
									Round {round} of {totalRounds}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div
									className="bg-blue-600 h-2.5 rounded-full"
									style={{ width: `${(round / totalRounds) * 100}%` }}
								></div>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex flex-col items-center space-y-3">
							<button
								onClick={onClose}
								className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-md"
							>
								{isGameOver ? "See Final Score" : "Next Round"}
							</button>

							{/* Report Issue Button */}
							{hasReported ? (
								<p className="text-sm text-green-600 font-medium animate-pulse">
									Image reported. Thank you!
								</p>
							) : (
								<button
									onClick={handleReportClick}
									className="text-xs sm:text-sm text-red-500 hover:underline focus:outline-none"
								>
									Report issue with image or coordinates
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ResultsPopup;

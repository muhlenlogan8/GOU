import React from "react";
import { motion } from "framer-motion";

const GameOverPopup = ({
	score,
	onSubmit,
	onDismiss,
	name,
	onNameChange,
	error,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white text-center">
					<h2 className="text-2xl font-bold">🎉 Congratulations!</h2>
					<p className="text-blue-100 text-sm mt-1">
						Your score made the leaderboard!
					</p>
				</div>

				<div className="p-6">
					<div className="mb-5 text-center">
						<div className="text-xl font-bold text-gray-800">
							Your score: <span className="text-blue-600">{score}</span>
						</div>
						<p className="text-gray-600 mt-2">
							Submit your name to secure your spot on the leaderboard!
						</p>
					</div>

					<div className="space-y-4">
						{/* Name Input */}
						<div>
							<input
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={onNameChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-lg outline-none"
								maxLength={15}
							/>
							<p className="text-xs text-gray-500 mt-1 ml-1">
								Maximum 15 characters
							</p>
						</div>

						{/* Error Message */}
						{error && <p className="text-red-500 text-sm">{error}</p>}

						{/* Buttons */}
						<div className="flex space-x-3 pt-2">
							<button
								onClick={onDismiss}
								className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
							>
								Skip
							</button>
							<button
								onClick={onSubmit}
								className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default GameOverPopup;

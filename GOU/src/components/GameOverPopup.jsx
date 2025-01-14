import React from "react";

const GameOverPopup = ({
	score,
	onSubmit,
	onDismiss,
	name,
	onNameChange,
	error,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div
				className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-11/12 max-w-md animate-fadeIn"
				style={{
					background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
					border: "1px solid #ddd",
				}}
			>
				<h2 className="text-3xl font-extrabold mb-3 sm:mb-6 text-center text-black">
					🎉 Congratulations!
				</h2>
				<p className="text-center text-lg font-medium mb-4 text-gray-800">
					Your score of{" "}
					<span className="font-bold text-green-600">{score}</span> is in the
					top 10! Submit your name to secure your spot on the leaderboard.
				</p>

				<div className="flex flex-col items-center space-y-4">
					{/* Name Input */}
					<input
						type="text"
						placeholder="Enter your name"
						value={name}
						onChange={onNameChange}
						className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>

					{/* Submit Button */}
					<button
						onClick={onSubmit}
						className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
					>
						Submit Score
					</button>

					{/* Dismiss Button */}
					<button
						onClick={onDismiss}
						className="w-full py-3 bg-gray-300 text-n-6 rounded-lg font-semibold hover:bg-gray-400 transition-all"
					>
						No Thanks
					</button>
				</div>

				{/* Error Message */}
				{error && <p className="text-red-500 mt-3 text-center">{error}</p>}
			</div>
		</div>
	);
};

export default GameOverPopup;

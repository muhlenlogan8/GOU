import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FeedbackPopup from "./FeedbackPopup";

const AlreadyPlayedToday = () => {
	const [showFeedback, setShowFeedback] = useState(false);
	const navigate = useNavigate();

	// Handle feedback popup visibility
	const openFeedbackPopup = () => {
		setShowFeedback(true);
	};

	const closeFeedbackPopup = () => {
		setShowFeedback(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-n-2 px-4 py-6 md:py-0">
			<motion.div
				className="bg-white rounded-lg shadow-lg p-5 sm:p-8 w-full max-w-md text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="mb-5">
					<motion.div
						className="mx-auto w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-4"
						animate={{
							scale: [1, 1.1, 1],
						}}
						transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-yellow-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</motion.div>

					<h1 className="text-xl sm:text-2xl font-bold mb-3">Nice try!</h1>

					<p className="text-gray-600 mb-4">
						Sources are saying you've already played the daily challenge today.
					</p>

					<div className="text-sm text-gray-500 mb-5 p-3 bg-gray-50 rounded-lg">
						Think this is a mistake?{" "}
						<button
							onClick={openFeedbackPopup}
							className="text-blue-500 font-medium underline hover:text-blue-700"
						>
							Report it here
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => navigate("/")}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
					>
						Return to Home
					</button>

					<Link to="/quick-play" className="w-full">
						<button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors">
							Try Quick Play Instead
						</button>
					</Link>
				</div>
			</motion.div>

			{/* Feedback Popup - matching the implementation from Home.jsx */}
			<FeedbackPopup
				isVisible={showFeedback}
				onClose={closeFeedbackPopup}
				initialMessage="I believe there's a mistake - I haven't played today's challenge yet."
			/>
		</div>
	);
};

export default AlreadyPlayedToday;

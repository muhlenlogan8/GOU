import React, { useState } from "react";
import { motion } from "framer-motion";
import HomeHeader from "../components/HomeHeader";
import Hero from "../components/Hero";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";
import GameSelectionMenu from "../components/GameSelectionMenu";
import FeedbackPopup from "../components/FeedbackPopup";

const LandingPage = () => {
	const [showGameSelection, setShowGameSelection] = useState(false);
	const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

	// Handle open menu
	const handlePlayClick = () => {
		setShowGameSelection(true);
	};

	// Handle close menu
	const closeGameSelection = () => {
		setShowGameSelection(false);
	};

	// Handle game selection
	const handleGameSelection = (mode) => {
		setShowGameSelection(false); // Close menu

		// Navigate to the selected game
		if (mode === "daily-challenge") {
			window.location.href = "/daily-challenge"; // Navigate to daily challenge page
		} else if (mode === "quick-play") {
			window.location.href = "/quick-play"; // Navigate to quick play page
		}
	};

	// Handle feedback popup visibility
	const openFeedbackPopup = () => {
		setShowFeedbackPopup(true);
	};

	const closeFeedbackPopup = () => {
		setShowFeedbackPopup(false);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<HomeHeader
				handlePlayClick={handlePlayClick}
				openFeedbackPopup={openFeedbackPopup}
			/>

			{/* Hero Section */}
			<Hero handlePlayClick={handlePlayClick} />

			{/* Leaderboard Section */}
			<motion.section
				className="py-16 px-4 md:px-8"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				viewport={{ once: true }}
			>
				<div className="max-w-6xl mx-auto">
					<motion.div
						className="text-center mb-10"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 pb-1">
							Leaderboard
						</h2>
						<p className="text-gray-600 max-w-lg mx-auto mt-2">
							Think you know UC's campus better than anyone? Prove it by
							climbing our leaderboard!
						</p>
					</motion.div>

					<Leaderboard showToggle={true} />
				</div>
			</motion.section>

			{/* Footer */}
			<Footer />

			{/* Game Selection Menu */}
			<GameSelectionMenu
				isVisible={showGameSelection}
				onClose={closeGameSelection}
				onSelect={handleGameSelection}
			/>

			{/* Feedback Popup */}
			<FeedbackPopup
				isVisible={showFeedbackPopup}
				onClose={closeFeedbackPopup}
			/>
		</div>
	);
};

export default LandingPage;

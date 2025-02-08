import React, { useState } from "react";
import HomeHeader from "../components/HomeHeader";
import Hero from "../components/Hero";
import Mission from "../components/Mission";
import Leaderboard from "../components/Leaderboard";
import Testimonial from "../components/Testimonial";
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
		<>
			<HomeHeader
				handlePlayClick={handlePlayClick}
				openFeedbackPopup={openFeedbackPopup}
			/>
			<Hero handlePlayClick={handlePlayClick} />
			<div className="pt-12 px-4 bg-n-2">
				<Leaderboard showToggle={true} />
			</div>
			{/* <Mission /> */}
			<Testimonial />
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
		</>
	);
};

export default LandingPage;

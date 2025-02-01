import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./subcomponents/GameCard";
import dailyChallengeIcon from "../assets/daily-challenge.svg";
import quickPlayIcon from "../assets/quick-play.svg";

const isMobileDevice = () =>
	/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const GameSelectionMenu = ({ isVisible, onClose, onSelect }) => {
	const [hasPlayedToday, setHasPlayedToday] = useState(false);
	const isMobile = isMobileDevice();

	useEffect(() => {
		const lastPlayedDate = localStorage.getItem("dailyChallengePlayed");

		// Get today's date
		const today = new Date().toISOString().split("T")[0];

		// Check if the last played date is today
		if (lastPlayedDate === today) {
			setHasPlayedToday(true);
		}
	}, []);

	const handleDailyChallengeClick = () => {
		if (hasPlayedToday) return; // Prevent click if already played

		const today = new Date().toISOString().split("T")[0];

		// Save today's date to local storage
		localStorage.setItem("dailyChallengePlayed", today);
		setHasPlayedToday(true);

		onSelect("daily-challenge");
	};

	if (!isVisible) return null;

	return (
		<motion.div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-white rounded-lg p-6 m-6 w-full max-w-2xl shadow-lg relative overflow-hidden"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
			>
				<h2 className="text-2xl font-bold text-center mb-6">
					Select Game Mode
				</h2>
				{/* Responsive Grid for Cards */}
				<div
					className={`grid gap-4 ${
						isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
					}`}
				>
					{/* Quick Play Card */}
					<Card
						title="Quick Play"
						description="Jump into a quick play game where you'll be shown 5 random images and have to guess the location they were taken!"
						gradient="dynamic-bg"
						svgIcon={quickPlayIcon}
						onClick={() => onSelect("quick-play")}
						isMobile={isMobile}
					/>
					{/* Daily Challenge Card */}
					<div className="relative">
						<Card
							title="Daily Challenge"
							description="Take on today's challenge and see how you rank on the daily leaderboard!"
							gradient="dynamic-bg-2"
							svgIcon={dailyChallengeIcon}
							onClick={hasPlayedToday ? null : handleDailyChallengeClick}
							isMobile={isMobile}
							className={`transition-opacity ${
								hasPlayedToday ? "opacity-50 grayscale pointer-events-none" : ""
							}`}
						/>

						{/* Overlay message when already played */}
						{hasPlayedToday && (
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
								<p className="text-white text-lg font-bold">Already Played  Today</p>
							</div>
						)}
					</div>
				</div>
				{/* Close Button */}
				<button
					className="w-full py-3 mt-6 bg-blue-500 text-white rounded-lg shadow-md font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
					onClick={onClose}
				>
					Close
				</button>
			</motion.div>
		</motion.div>
	);
};

export default GameSelectionMenu;

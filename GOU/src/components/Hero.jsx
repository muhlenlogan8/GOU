import React from "react";
import { motion } from "framer-motion"; // For animations
import backgroundImage from "../assets/University_Of_Cincinnati.jpg";

const Hero = ({ handlePlayClick }) => {
	return (
		<div className="relative h-screen bg-cover bg-center flex items-center justify-center">
			{/* Blurred background image */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					filter: "blur(6px)", // Apply blur to the background image
					zIndex: -1, // Ensure it's behind other content
					backgroundSize: "cover", // Ensure image covers entire area
					backgroundPosition: "center", // Ensure image is centered
				}}
			/>
			{/* Main Content */}
			<div className="relative z-10 text-center px-6 py-16 sm:py-32 lg:py-48 max-w-3xl">
				{/* Welcome Title */}
				<motion.h1
					className="text-5xl sm:text-6xl font-extrabold text-white tracking-wide mb-10"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Welcome to <br /><span className="text-white">Uni-Guesser!</span>
				</motion.h1>

				{/* Description */}
				<motion.p
					className="text-lg sm:text-xl text-white leading-relaxed font-semibold"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					Test your knowledge of the University of Cincinnati’s campus, try our daily challenge, and climb the leaderboard!
				</motion.p>

				{/* Play Now Button */}
				<motion.div
					className="mt-10 flex justify-center"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, delay: 1 }}
				>
					<motion.button
						onClick={handlePlayClick}
						className="rounded-lg px-8 py-4 bg-blue-500 text-white font-semibold text-xl shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
						whileHover={{ scale: 1.1 }}
					>
						Play Now
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default Hero;

import React from "react";
import { motion } from "framer-motion";
import backgroundImage from "../assets/University_Of_Cincinnati.jpg";
import foregroundImage from "../assets/Hero-Foreground.png";
import cloudsImage from "../assets/Hero-Clouds.png";

const Hero = ({ handlePlayClick }) => {
	return (
		<div className="relative h-[90vh] bg-cover bg-center flex items-center justify-center overflow-hidden">
			{/* Background image with subtle zoom effect and reduced blur */}
			<motion.div
				className="absolute inset-0"
				initial={{ scale: 1.05 }}
				animate={{ scale: 1 }}
				transition={{ duration: 6, ease: "easeOut" }}
				style={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "blur(2px)", // Reduced blur for better visibility
				}}
			/>

			{/* Overlay with light gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-black/15"></div>

			{/* Main Content */}
			<div className="relative z-10 text-center px-6 py-16 sm:py-20 max-w-3xl">
				{/* Welcome Title */}
				<motion.h1
					className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wide mb-6 drop-shadow-lg"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					Welcome to{" "}
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
						UniGuesser!
					</span>
				</motion.h1>

				{/* Description */}
				<motion.p
					className="text-lg sm:text-xl text-white leading-relaxed font-medium mb-12 max-w-2xl mx-auto drop-shadow-md"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				>
					Test your knowledge of the University of Cincinnati's campus, tackle
					our daily challenge, and show off your UC know-how on the leaderboard!
				</motion.p>

				{/* Play Now Button */}
				<motion.div
					className="flex justify-center"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
				>
					<motion.button
						onClick={handlePlayClick}
						className="rounded-lg px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xl shadow-xl hover:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
					>
						Play Now
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
};

export default Hero;

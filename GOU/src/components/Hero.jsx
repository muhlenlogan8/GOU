import React from "react";
import { motion } from "framer-motion"; // For animations
import backgroundImage from "../assets/University_Of_Cincinnati.jpg";

const Hero = () => {
	return (
		<div className="relative h-screen bg-cover bg-center flex items-center justify-center">
			{/* Blurred background image */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					filter: "blur(5px)", // Apply blur only to the background image
					zIndex: -1, // Ensure it's behind other content
					backgroundSize: "cover", // Ensure image covers entire area
					backgroundPosition: "center", // Ensure image is centered
				}}
			/>
			<div className="relative z-10 text-center px-6 py-16 sm:py-32 lg:py-48">
				{/* Animate Welcome to Uni-Guesser to fade in on view */}
				<motion.h1
					className="text-5xl font-bold text-white tracking-wide"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					Welcome to Uni-Guesser!
				</motion.h1>
				<p className="mt-4 text-xl sm:text-2xl font-semibold text-gray-200">
					Test your knowledge of the University of Cincinnati’s campus!
					<br /> Can you guess the location from just an image?
					<br /> Challenge your friends and compete to get on the leaderboard!
				</p>
				<div className="mt-10 flex justify-center">
					{/* Animate Play Now button to get bigger on hover */}
					<motion.a
						href="/play"
						className="rounded-lg bg-n-6 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
						whileHover={{ scale: 1.05 }}
					>
						Play Now
					</motion.a>
				</div>
			</div>
		</div>
	);
};

export default Hero;

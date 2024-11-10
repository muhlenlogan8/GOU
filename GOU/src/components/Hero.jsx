import React from "react";
import { motion } from "framer-motion"; // For animations

const Hero = () => {
	return (
		<div className="bg-blue-300 h-screen flex items-center justify-center">
			<div className="text-center px-6 py-16 sm:py-32 lg:py-48">
				<motion.h1 
					className="text-5xl font-bold text-gray-800 tracking-wide" 
					initial={{ opacity: 0 }} 
					animate={{ opacity: 1 }} 
					transition={{ duration: 1 }}
				>
					GOU
				</motion.h1>
				<p className="mt-4 text-xl sm:text-2xl text-gray-600">
					Geoguesser for campus, buildings, companies, and other locations
				</p>
				<div className="mt-10 flex justify-center">
					<motion.a
						href="/play"
						className="rounded-lg bg-slate-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-500 transition duration-300 transform hover:scale-105"
						whileHover={{ scale: 1.05 }}
					>
						Start Now
					</motion.a>
				</div>
			</div>
		</div>
	);
};

export default Hero;

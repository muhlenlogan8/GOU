import React from "react";
import { motion } from "framer-motion"; // For animations
import backgroundImage from "../assets/University_Of_Cincinnati.jpg"; // Adjust path as necessary

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
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 py-16 sm:py-32 lg:py-48">
        <motion.h1 
          className="text-5xl font-bold text-white tracking-wide" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          Welcome to Uni-Guesser!
        </motion.h1>
        <p className="mt-4 text-xl sm:text-2xl text-gray-200">
		Test your knowledge of the University of Cincinnati’s campus!<br /> Can you guess the location from a few clues?<br /> Challenge your friends and see who knows the campus best!
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

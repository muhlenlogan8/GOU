import React from "react";
import logo from "../assets/Logo.png";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center text-center">
					{/* Logo and Name */}
					<div className="flex items-center mb-2">
						<img src={logo} alt="UniGuesser Logo" className="w-7 h-7 mr-2" />
						<span className="text-base font-bold">UniGuesser</span>
					</div>

					{/* Created with heart message */}
					<p className="text-xs text-gray-300">
						Created with <span className="text-red-400">♥</span> for students
					</p>

					{/* Copyright */}
					<p className="mt-1 text-xs text-gray-500">
						© {new Date().getFullYear()} UniGuesser. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

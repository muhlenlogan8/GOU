import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Logo.png";
import Banner from "./Banner";

const Header = ({ handlePlayClick, openFeedbackPopup }) => {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setScrolled(scrollTop > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
			<Banner openFeedbackPopup={openFeedbackPopup} />

			<div
				className={`${
					scrolled
						? "bg-white/95 shadow-md backdrop-blur-md border-b border-gray-200"
						: "bg-transparent"
				} transition-all duration-300`}
			>
				<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
					{/* Left aligned Logo and Name */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center"
					>
						<a href="/" className="flex items-center space-x-2 group">
							<img
								src={logo}
								alt="Uni-Guesser Logo"
								className="h-10 w-10 transition-transform group-hover:scale-110"
							/>
							<span
								className={`text-xl font-bold ${
									scrolled ? "text-gray-800" : "text-white drop-shadow-md"
								} transition-colors duration-300`}
							>
								UniGuesser
							</span>
						</a>
					</motion.div>

					{/* Play Button - Always visible on all screen sizes */}
					<div className="flex justify-end">
						<motion.button
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							onClick={handlePlayClick}
							className={`flex px-5 py-2 ${
								scrolled
									? "bg-blue-600 hover:bg-blue-700"
									: "bg-blue-500/90 hover:bg-blue-600"
							} text-white font-medium rounded-lg shadow-md transition-all duration-300`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Play Game
						</motion.button>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;

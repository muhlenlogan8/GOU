import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackPopup from "./FeedbackPopup";

const Banner = ({ openFeedbackPopup }) => {
	const [isVisible, setIsVisible] = useState(true);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const handleClose = () => setIsVisible(false);
	const handleClosePopup = () => setIsPopupOpen(false);

	if (!isVisible) return null;

	return (
		<>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-white text-gray-700 shadow-sm border-b border-gray-200"
					>
						<div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between relative">
								{/* Close button positioned at the top right for all screen sizes */}
								<button
									onClick={handleClose}
									className="p-1 rounded-md hover:bg-gray-200 text-gray-500 focus:outline-none transition-colors absolute right-0 top-0 z-10"
									aria-label="Close banner"
								>
									<svg
										className="h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>

								{/* Content container with proper right padding for the close button */}
								<div className="flex items-center justify-center text-center w-full pr-6">
									<div className="flex items-center">
										<span className="flex items-center">
											<svg
												className="h-5 w-5 text-blue-600"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</span>
										<div className="flex items-center">
											{/* Mobile text */}
											<p className="ml-1 font-medium text-sm md:hidden">
												Feedback or suggestions?
											</p>

											{/* Desktop text */}
											<p className="ml-1 font-medium text-sm md:text-base hidden md:block">
												UniGuesser is still in development! If you'd like to
												provide feedback or suggestions
											</p>

											<button
												onClick={openFeedbackPopup}
												className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer transition-colors"
											>
												Click Here!
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<FeedbackPopup isVisible={isPopupOpen} onClose={handleClosePopup} />
		</>
	);
};

export default Banner;

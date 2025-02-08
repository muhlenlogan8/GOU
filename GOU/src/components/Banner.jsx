import { useState } from "react";
import FeedbackPopup from "./FeedbackPopup";

const Banner = ({ openFeedbackPopup }) => {
	const [isVisible, setIsVisible] = useState(true);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const handleClose = () => setIsVisible(false);
	const handleClosePopup = () => setIsPopupOpen(false);

	if (!isVisible) return null;

	return (
		<>
			<div className="fixed w-full px-4 bg-n-2 text-black text-sm text-center p-2 flex justify-center items-center">
				<p className="flex-1">
					🚧 <strong>Uni-Guesser is still in development!</strong> Have a
					feature suggestion or found an issue?
					<button
						onClick={openFeedbackPopup}
						className="text-blue-400 underline ml-1"
					>
						Click Here!
					</button>
				</p>
				<button
					onClick={handleClose}
					className="p-1 text-black text-lg sm:text-xl font-bold rounded-md hover:bg-gray-300 transition"
					aria-label="Close banner"
				>
					✕
				</button>
			</div>
			{/* Feedback Popup */}
			<FeedbackPopup isVisible={isPopupOpen} onClose={handleClosePopup} />
		</>
	);
};

export default Banner;

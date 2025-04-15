import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase from "../../supabase"; // Ensure this path is correct

const FeedbackPopup = ({ isVisible, onClose, initialMessage = "" }) => {
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const discordInviteLink = "https://discord.gg/2eVp36kMcY";

	// Set description to initialMessage when the component mounts or initialMessage changes
	useEffect(() => {
		if (initialMessage && isVisible) {
			setDescription(initialMessage);
		}
	}, [initialMessage, isVisible]);

	// Reset state when popup is closed
	useEffect(() => {
		if (!isVisible) {
			setError("");
			setSuccess(false);
			// Don't reset description here to preserve content between visibility toggles
		}
	}, [isVisible]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!description.trim()) {
			setError("Feedback cannot be empty.");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const { error } = await supabase.from("feedback").insert([
				{
					description: description.trim(),
				},
			]);

			if (error) throw error;

			setSuccess(true);
			setTimeout(() => {
				onClose();
				setSuccess(false);
				setDescription(""); // Reset description after successful submission
			}, 2000);
		} catch (err) {
			setError("Failed to submit feedback. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isVisible) return null;

	return (
		<motion.div
			className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-white rounded-xl p-4 m-4 w-full max-w-md shadow-xl relative overflow-hidden"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				{/* Header with gradient background */}
				<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

				{/* Centered close button at the top */}
				<div className="flex justify-center mb-2">
					<button
						className="w-14 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 transition-colors"
						onClick={onClose}
						aria-label="Close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<h2 className="text-xl font-bold text-center mb-2">Submit Feedback</h2>

				{/* Discord section - centered */}
				<div className="text-center mb-3">
					<a
						href={discordInviteLink}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
						>
							<path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
						</svg>
						Connect with Devs on Discord
					</a>
				</div>

				{/* Divider with "or" in the middle - just like ReportImagePopup */}
				<div className="relative mb-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center">
						<span className="bg-white px-3 text-xs text-gray-500">
							or submit feedback below
						</span>
					</div>
				</div>

				{/* Feedback section */}
				<p className="text-sm text-gray-600 text-center mb-3">
					Your feedback helps us improve UniGuesser. All submissions are
					anonymous.
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<textarea
						placeholder="Describe your feedback, suggestion, or report an issue..."
						className={`border p-3 rounded-lg resize-y min-h-24 transition-all ${
							description.trim()
								? "border-blue-500 bg-blue-50"
								: "border-gray-200"
						}`}
						style={{
							maxHeight: "30vh",
							minHeight: "120px",
							overflowY: "auto",
						}}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>

					{/* Error and Success Messages */}
					{error && (
						<div className="p-2 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-600 text-sm text-center">{error}</p>
						</div>
					)}
					{success && (
						<div className="p-2 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-green-600 text-sm text-center">
								Thank you! Your feedback has been submitted.
							</p>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className={`py-3 px-4 rounded-lg font-medium text-white shadow-sm transition-all ${
							isSubmitting
								? "bg-gray-400 cursor-not-allowed"
								: description.trim()
								? "bg-blue-600 hover:bg-blue-700"
								: "bg-gray-400 cursor-not-allowed"
						}`}
						disabled={isSubmitting || !description.trim()}
					>
						{isSubmitting ? "Submitting..." : "Submit Feedback"}
					</button>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default FeedbackPopup;

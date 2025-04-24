import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase from "../../../supabase";

const ReportImagePopup = ({
	isVisible,
	onClose,
	imageTitle = "",
	gameId = "",
}) => {
	const [selectedOption, setSelectedOption] = useState("");
	const [customDescription, setCustomDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	// Reset the submission state when the popup visibility changes
	useEffect(() => {
		if (isVisible) {
			setIsSubmitted(false);
		}
	}, [isVisible]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Ensure one option is selected
		if (!selectedOption && !customDescription.trim()) {
			setError("Please select an option or provide a description.");
			return;
		}

		// Prevent multiple submissions
		if (isSubmitted) return;

		setIsSubmitting(true);
		setError("");

		try {
			// Insert the report into the Supabase database
			const { error } = await supabase.from("reported").insert([
				{
					image: imageTitle,
					description: selectedOption || customDescription.trim(),
					gameId: gameId || null,
				},
			]);

			if (error) throw error;

			setSuccess(true);
			setIsSubmitted(true); // Mark as submitted to prevent multiple submissions

			setTimeout(() => {
				onClose(true); // Pass true to indicate a report was successfully submitted
				setSuccess(false);
				setSelectedOption("");
				setCustomDescription("");
			}, 2000);
		} catch (err) {
			setError("Failed to submit the report. Please try again.");
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
						onClick={() => onClose(false)}
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

				<p className="text-sm text-black text-center mb-4">
					Help us improve by reporting any problems with this image.
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col space-y-5">
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-700 mb-1">
							Quick options:
						</p>

						{/* Option cards instead of radio buttons */}
						<button
							type="button"
							onClick={() => {
								setSelectedOption(
									"Image quality issues (blurry, dark, or inappropriate)"
								);
								setCustomDescription("");
							}}
							className={`w-full p-3 text-left rounded-lg transition-all ${
								selectedOption ===
								"Image quality issues (blurry, dark, or inappropriate)"
									? "bg-blue-100 border-2 border-blue-500"
									: "bg-gray-50 border border-gray-200 hover:bg-gray-100"
							}`}
						>
							<span className="text-sm font-medium">Image Quality Issues</span>
							<p className="text-xs text-gray-500 mt-1">
								The image is blurry, too dark, or contains inappropriate content
							</p>
						</button>

						<button
							type="button"
							onClick={() => {
								setSelectedOption("Location pin is inaccurate or misleading");
								setCustomDescription("");
							}}
							className={`w-full p-3 text-left rounded-lg transition-all ${
								selectedOption === "Location pin is inaccurate or misleading"
									? "bg-blue-100 border-2 border-blue-500"
									: "bg-gray-50 border border-gray-200 hover:bg-gray-100"
							}`}
						>
							<span className="text-sm font-medium">Location Pin Issue</span>
							<p className="text-xs text-gray-500 mt-1">
								The correct location marker doesn't match the image's actual
								location
							</p>
						</button>
					</div>

					{/* Divider with "or" in the middle */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center">
							<span className="bg-white px-3 text-xs text-gray-500">
								or describe the issue
							</span>
						</div>
					</div>

					{/* Custom Description */}
					<textarea
						placeholder="Provide additional details about the issue..."
						className={`border p-3 rounded-lg resize-y min-h-24 transition-all ${
							customDescription
								? "border-blue-500 bg-blue-50"
								: "border-gray-200"
						}`}
						value={customDescription}
						onChange={(e) => {
							setCustomDescription(e.target.value);
							if (e.target.value.trim()) {
								setSelectedOption(""); // Clear selected option when typing
							}
						}}
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
								Thank you! Your report has been submitted.
							</p>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className={`py-3 px-4 rounded-lg font-medium text-white shadow-sm transition-all ${
							isSubmitting || isSubmitted
								? "bg-gray-400 cursor-not-allowed"
								: selectedOption || customDescription.trim()
								? "bg-blue-600 hover:bg-blue-700"
								: "bg-gray-400 cursor-not-allowed"
						}`}
						disabled={
							isSubmitting ||
							isSubmitted ||
							(!selectedOption && !customDescription.trim())
						}
					>
						{isSubmitting
							? "Submitting..."
							: isSubmitted
							? "Report Submitted"
							: "Submit Report"}
					</button>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default ReportImagePopup;

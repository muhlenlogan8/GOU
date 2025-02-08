import React, { useState } from "react";
import { motion } from "framer-motion";
import supabase from "../../supabase"; // Ensure this path is correct

const FeedbackPopup = ({ isVisible, onClose }) => {
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

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
				setDescription("");
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
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-white rounded-lg p-6 m-6 w-full max-w-md shadow-lg relative"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				<h2 className="text-xl font-bold text-center mb-2">Submit Feedback</h2>
				<p className="text-sm text-gray-600 text-center mb-4">
					All feedback is anonymous. If you experience issues or have
					suggestions, let us know!
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<textarea
						placeholder="Describe your feedback..."
						className="border p-2 rounded resize-y max-h-40 min-h-24"
						style={{
							maxHeight: "40vh", // Prevents expansion past 40% of the viewport height
							minHeight: "96px", // Ensures the textarea is always at least this tall
							overflowY: "auto", // Adds scrollbar when necessary
						}}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>

					{error && <p className="text-red-500 text-sm text-center">{error}</p>}
					{success && (
						<p className="text-green-500 text-sm text-center">
							Submitted successfully!
						</p>
					)}

					<button
						type="submit"
						className={`py-2 px-4 rounded bg-blue-500 text-white font-semibold transition ${
							isSubmitting
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-blue-600"
						}`}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Submit"}
					</button>
				</form>

				<button
					className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
					onClick={onClose}
					aria-label="Close"
				>
					✕
				</button>
			</motion.div>
		</motion.div>
	);
};

export default FeedbackPopup;

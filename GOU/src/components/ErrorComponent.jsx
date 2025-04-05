import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorComponent = ({
	title = "Oops! Something went wrong",
	message = "An error occurred. Please try again later.",
	errorDetails = null,
	onReport = null
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-n-2 px-4 py-6 md:py-0">
			<div className="bg-white rounded-lg shadow-lg p-5 sm:p-8 w-full max-w-md text-center">
				<div className="mb-5">
					<div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>

					<h1 className="text-xl sm:text-2xl font-bold mb-3">{title}</h1>

					<p className="text-gray-600 mb-4">{message}</p>

					{errorDetails && (
						<div className="text-sm text-gray-500 mb-5 p-3 bg-gray-50 rounded-lg">
							<p className="mb-2">Technical details:</p>
							<p className="font-mono text-xs overflow-auto max-h-24">
								{errorDetails}
							</p>
							{onReport && (
								<button
									onClick={onReport}
									className="text-blue-500 font-medium underline hover:text-blue-700 mt-2"
								>
									Report this issue
								</button>
							)}
						</div>
					)}
				</div>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => navigate("/")}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
					>
						Return to Home
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorComponent;

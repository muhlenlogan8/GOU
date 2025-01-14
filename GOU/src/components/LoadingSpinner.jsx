import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
			<div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full"></div>
			<p className="mt-4 text-lg text-gray-700">{text}</p>
		</div>
	);
};

export default LoadingSpinner;
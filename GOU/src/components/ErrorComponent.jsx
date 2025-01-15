import React from "react";

const ErrorComponent = ({ text = "Error" }) => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen bg-n-2">
			<p className="mt-4 text-xl text-gray-700">{text}</p>
		</div>
	);
};

export default ErrorComponent;
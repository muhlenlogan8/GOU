import React, { useState } from "react";

const Map = ({ mapSrc, onCoordinatesSubmit }) => {
    const [coordinates, setCoordinates] = useState(null);

	const handleMapClick = (event) => {
		const rect = event.target.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		setCoordinates({ x, y });
	};

	const handleSubmit = () => {
		if (coordinates && onCoordinatesSubmit) {
			onCoordinatesSubmit(coordinates);
		}
	};
	return (
		<div className="fixed bottom-20 right-2 w-52 hover:w-96 border border-gray-300 rounded-lg p-3 bg-gray-100 shadow-md">
			<div className="overflow-hidden cursor-pointer" onClick={handleMapClick}>
				<img src={mapSrc} alt="Map" className="w-full h-auto" />
			</div>
			<button
				onClick={handleSubmit}
				className="mt-2 w-full py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none"
			>
				Submit Coordinates
			</button>
			{coordinates && (
				<p className="mt-2 text-sm text-gray-700">
					Coordinates: ({coordinates.x.toFixed(1)}, {coordinates.y.toFixed(1)})
				</p>
			)}
		</div>
	);
};

export default Map;

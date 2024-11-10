import React from "react";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import Footer from "../components/Footer";

const Play = () => {
	const handleCoordinatesSubmit = (coords) => {
		console.log("Submitted Coordinates:", coords);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex-grow flex overflow-hidden">
				<div className="w-2/5 p-4">
					<ImageContainer />
				</div>
				<div className="w-3/5 p-4">
					<Map onCoordinatesSubmit={handleCoordinatesSubmit} />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Play;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import Footer from "../components/Footer";

const Play = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const [round, setRound] = useState(1);
	const imageContainerRef = useRef(null);
	const mapRef = useRef(null);
	const navigate = useNavigate();

	const totalRounds = 5;
	const actualPoint = { lat: 39.13211, lng: -84.5158 };

	const handleCoordinatesSubmit = (data) => {
		setSubmittedData(data);
		setShowPopup(true);
		const distanceMeters = L.latLng(data.coordinates).distanceTo(actualPoint);
		const score = Math.max(0, 100 - distanceMeters / 10);
		imageContainerRef.current.handleScoreUpdate(score); // Update score in ImageContainer
	};

	const handleClosePopup = () => {
		setShowPopup(false);
		setSubmittedData(null);
		if (round < totalRounds) {
			setRound(round + 1);
		} else {
			navigate("/game-over");
		}

		if (mapRef.current) {
			mapRef.current.resetMap();
		}
		if (imageContainerRef.current) {
			imageContainerRef.current.nextRound();
		}
	};

	return (
		<div className="flex flex-col h-full relative">
			<div className="flex-grow flex overflow-hidden">
				<div className="w-2/5 p-4 relative">
					<ImageContainer ref={imageContainerRef} round={round} />
					{showPopup && (
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-8 rounded shadow-lg w-3/4">
								<h2 className="text-2xl font-bold mb-4 text-center">Result</h2>
								<p className="text-center">
									Submitted Point:{" "}
									{submittedData?.coordinates
										? `${submittedData.coordinates.lat.toFixed(
												5
										  )}, ${submittedData.coordinates.lng.toFixed(5)}`
										: "No coordinates submitted"}
								</p>
								<p className="text-center">
									Distance from actual location:{" "}
									{submittedData?.distance || "N/A"} meters
								</p>
								<div className="flex justify-center">
									<button
										onClick={handleClosePopup}
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										Next Round
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="w-3/5 p-4">
					<Map
						ref={mapRef}
						onCoordinatesSubmit={handleCoordinatesSubmit}
						actualPoint={actualPoint}
						round={round} // Pass round info to the Map component
					/>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Play;

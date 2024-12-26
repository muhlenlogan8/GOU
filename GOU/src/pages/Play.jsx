import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import Footer from "../components/Footer";

const Play = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const [round, setRound] = useState(1);
	const [imagesData, setImagesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [gameId, setGameId] = useState(uuidv4()); // Generate a unique game ID
	const navigate = useNavigate();

	// useRef to access the ImageContainer and Map components directly (For updating score and resetting map)
	const imageContainerRef = useRef(null);
	const mapRef = useRef(null);

	const totalRounds = 5;
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // From Vercel environment variables

	// Fetch images data from the backend
	useEffect(() => {
		fetch(`${BACKEND_URL}/api/data`)
			// fetch("api/data")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setImagesData(data);
				setLoading(false);
				setRound(1); // Reset round to 1 after fetching new data
			})
			.catch((error) => {
				setError(error);
				setLoading(false);
			});
	}, []); // , [] means this effect will run only once after the initial render

	// Check for loading, error, or no data and return appropriate messages if so
	if (loading) {
		return <div>Loading...</div>;
	} else if (error) {
		return <div>Error: {error.message}</div>;
	} else if (imagesData.length === 0) {
		return <div>No images data available</div>;
	}

	// Handle the submission of coordinates and calculate the score
	const handleCoordinatesSubmit = (data) => {
		if (round > imagesData.length) {
			return <div>Not enough images to continue the game</div>;
		}

		// Set the current point lat and long to the coordinates of the image for the current round
		const currentPoint = {
			lat: imagesData[round - 1].latitude,
			lng: imagesData[round - 1].longitude,
		};

		// Calculate the distance in meters between the submitted coordinates and the actual location
		const distanceMeters = L.latLng(data.coordinates).distanceTo(currentPoint);
		let score = 0;

		// Calculate the score based on the distance from the actual location
		if (distanceMeters < 8) {
			score = 100;
		} else if (distanceMeters <= 100) {
			score = Math.max(0, 100 - distanceMeters + 8);
		}
		score = score.toFixed(2); // Round the score to 2 decimal points (score is a String, needs parseFloat to convert to number)
		
		setSubmittedData({ ...data, distance: distanceMeters, score }); // Update the submitted data to be displayed in UI
		setShowPopup(true);

		if (imageContainerRef.current) {
			imageContainerRef.current.handleScoreUpdate(parseFloat(score)); // Update score in ImageContainer by calling ImageContainer handleScoreUpdate function
		}
	};

	// Close the popup and navigate to the next round or end the game
	const handleClosePopup = () => {
		setShowPopup(false);
		setSubmittedData(null);
		if (round < totalRounds) {
			// Go to next round
			setRound(round + 1);
		} else {
			// Else if all rounds are completed, navigate to game over page
			const finalScore = imageContainerRef.current.getScore();
			navigate("/game-over", { state: { score: finalScore, gameId } }); // Pass the final score and game ID to the Game Over page
		}

		// Reset the map and image container for the next round (.current is used to access the current instance of the ref)
		if (mapRef.current) {
			mapRef.current.resetMap(); // Call resetMap function of the Map component
		}
	};

	return (
		<div className="bg-n-2 flex flex-col h-full relative">
			<div className="flex-grow flex flex-col md:flex-row overflow-hidden">
				<div className="w-full md:w-2/5 p-2 md:p-4 relative">
					<ImageContainer
						ref={imageContainerRef} // Allows direct access to the ImageContainer component
						round={round}
						imagesData={imagesData} // Pass the images data to the ImageContainer component
					/>
					{/* Conditionally render results popup if showPopup calls for it */}
					{showPopup && (
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-8 rounded shadow-lg w-3/4">
								<h2 className="text-2xl font-bold mb-4 text-center">Results</h2>
								<p className="text-center">
									Distance from actual location:{" "}
									{submittedData?.distance?.toFixed(2) || "N/A"} meters
								</p>
								<p className="text-center">
									Points: {submittedData?.score || 0}
								</p>
								<div className="flex justify-center">
									<button
										onClick={handleClosePopup} // Close the popup and go to next round or end game
										className="mt-4 px-4 py-2 bg-n-5 text-white rounded hover:bg-blue-600"
									>
										{round === 5 ? "End Game" : "Next Round"}{" "}
										{/* Change button text based on round */}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="w-full md:w-3/5 p-2 md:p-4 relative">
					{/* handleCoordinatesSubmit function is passed as onCoordinatesSubmit to the Map component so it can be used in the component */}
					<Map
						ref={mapRef}
						onCoordinatesSubmit={handleCoordinatesSubmit}
						imagesData={imagesData}
						round={round}
					/>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Play;

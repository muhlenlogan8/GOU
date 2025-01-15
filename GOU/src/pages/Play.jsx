import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import ResultsPopup from "../components/ResultsPopup";
import supabase from "../../supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorComponent from "../components/ErrorComponent";
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
		// fetch(`${BACKEND_URL}/api/data`)
		fetch("api/data")
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
		return <LoadingSpinner text="Preparing your game..." />;
	} else if (error) {
		return <ErrorComponent text={error.message} />;
	} else if (imagesData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-screen w-screen bg-n-2">
				<p className="mt-4 text-xl text-gray-700">No Image Data Avaliable</p>
			</div>
		);
	}

	// Handle the submission of coordinates and calculate the score
	const handleCoordinatesSubmit = (data) => {
		if (round > imagesData.length) {
			return (
				<div className="flex flex-col items-center justify-center h-screen w-screen bg-n-2">
					<p className="mt-4 text-xl text-gray-700">
						Not enough images to continue the game
					</p>
				</div>
			);
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
		if (distanceMeters < 10) {
			score = 100;
		} else if (distanceMeters <= 100) {
			score = Math.max(0, 100 - distanceMeters + 10);
		}
		score = score.toFixed(2); // Round the score to 2 decimal points (score is a String, needs parseFloat to convert to number)

		setSubmittedData({ ...data, distance: distanceMeters, score }); // Update the submitted data to be displayed in UI
		setShowPopup(true);

		if (imageContainerRef.current) {
			imageContainerRef.current.handleScoreUpdate(parseFloat(score)); // Update score in ImageContainer by calling ImageContainer handleScoreUpdate function
		}
	};

	// Submit reported image to supabase database
	const handleImageReport = async () => {
		const { data, error } = await supabase.from("reported").insert([
			{
				image: imagesData[round - 1].image_name,
				gameId,
			},
		]);
		if (error) {
			console.error("Error reporting image:", error.message);
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
		<div className="flex flex-col min-h-screen bg-n-2">
			<main className="flex-grow flex flex-col md:flex-row overflow-hidden">
				<div className="w-full md:w-1/2 pt-1 md:pl-2 relative flex items-center justify-center">
					<ImageContainer
						ref={imageContainerRef} // Allows direct access to the ImageContainer component
						round={round}
						imagesData={imagesData} // Pass the images data to the ImageContainer component
					/>
					{/* Conditionally render results popup if showPopup calls for it */}
					{showPopup && (
						<ResultsPopup
							distance={submittedData?.distance}
							score={submittedData?.score}
							round={round}
							totalRounds={totalRounds}
							onClose={handleClosePopup}
							isGameOver={round === totalRounds}
							onReport={handleImageReport} // Pass the handleImageReport function to the ResultsPopup component
						/>
					)}
				</div>
				<div className="w-full md:w-1/2 p-1 md:pr-2 relative">
					{/* handleCoordinatesSubmit function is passed as onCoordinatesSubmit to the Map component so it can be used in the component */}
					<Map
						ref={mapRef}
						onCoordinatesSubmit={handleCoordinatesSubmit}
						imagesData={imagesData}
						round={round}
					/>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Play;

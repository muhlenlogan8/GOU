import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import ResultsPopup from "../components/ResultsPopup";
import supabase from "../../supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import AlreadyPlayedToday from "../components/AlreadyPlayedToday";
import FeedbackPopup from "../components/FeedbackPopup";
import ErrorComponent from "../components/ErrorComponent";

const DailyPlay = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const [round, setRound] = useState(1);
	const [imagesData, setImagesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hasPlayedToday, setHasPlayedToday] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const navigate = useNavigate();

	// Generate a unique game ID when the component first mounts
	const gameId = useRef(uuidv4()).current;

	// useRef to access the ImageContainer and Map components directly (For updating score and resetting map)
	const imageContainerRef = useRef(null);
	const mapRef = useRef(null);

	const totalRounds = 5;
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // From Vercel environment variables

	// Redirect to home page if the play page is refreshed
	useEffect(() => {
		const [navEntry] = performance.getEntriesByType("navigation");
		if (navEntry && navEntry.type === "reload") {
			navigate("/");
		}
	}, [navigate]);

	// Check if the user has already played today's challenge
	useEffect(() => {
		const lastPlayedDate = localStorage.getItem("dailyChallengePlayed");
		const today = new Date().toISOString().split("T")[0];

		if (lastPlayedDate === today) {
			setHasPlayedToday(true);
			setLoading(false);
		} else {
			// Only fetch data if the user hasn't completed today's challenge
			setHasPlayedToday(false);
			fetchDailyData();
		}
	}, []);

	// Set up a listener to mark the game as played if the user leaves or refreshes
	useEffect(() => {
		const handleBeforeUnload = () => {
			// Only mark as played if the user has started the game (round > 1 or data is loaded)
			if ((!loading && !hasPlayedToday && imagesData.length > 0) || round > 1) {
				const today = new Date().toISOString().split("T")[0];
				localStorage.setItem("dailyChallengePlayed", today);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			// Also mark as played when component unmounts if the game was started
			if ((!loading && !hasPlayedToday && imagesData.length > 0) || round > 1) {
				const today = new Date().toISOString().split("T")[0];
				localStorage.setItem("dailyChallengePlayed", today);
			}
		};
	}, [loading, hasPlayedToday, imagesData.length, round]);

	// Fetch images data from the backend
	const fetchDailyData = () => {
		fetch(`${BACKEND_URL}/api/daily-data`)
			.then((response) => {
				// Check for text/html content-type which indicates an error page
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("text/html")) {
					throw new Error(
						"Received HTML response instead of JSON. The API endpoint might be down."
					);
				}

				if (!response.ok) {
					throw new Error(
						`Network response was not ok: ${response.status} ${response.statusText}`
					);
				}
				return response.json();
			})
			.then((data) => {
				if (!data || !Array.isArray(data) || data.length === 0) {
					throw new Error("No valid data received from API");
				}
				setImagesData(data);
				setLoading(false);
				setRound(1); // Reset round to 1 after fetching new data
			})
			.catch((error) => {
				console.error("API fetch error:", error);
				setError(error);
				setLoading(false);
			});
	};

	// Handle feedback popup visibility
	const openFeedbackPopup = () => {
		setShowFeedback(true);
	};

	const closeFeedbackPopup = () => {
		setShowFeedback(false);
	};

	// Check for loading, error, already played, or no data and return appropriate messages if so
	if (loading) {
		return <LoadingSpinner text="Preparing your game..." />;
	} else if (hasPlayedToday) {
		return <AlreadyPlayedToday />;
	} else if (error) {
		return (
			<>
				<ErrorComponent
					title="Oops! Something went wrong"
					message="We couldn't load today's challenge. Please try again later."
					errorDetails={error?.message || "Unknown error"}
					onReport={openFeedbackPopup}
				/>
				<FeedbackPopup
					isVisible={showFeedback}
					onClose={closeFeedbackPopup}
					initialMessage={`I encountered an error in Daily Challenge: ${
						error?.message || "Unknown error"
					}`}
				/>
			</>
		);
	} else if (imagesData.length === 0) {
		return (
			<>
				<ErrorComponent
					title="Oops! Something went wrong"
					message="We couldn't load today's challenge. Please try again later."
					errorDetails="No image data available"
					onReport={openFeedbackPopup}
					onRetry={() => {
						localStorage.removeItem("dailyChallengePlayed");
						window.location.reload();
					}}
					showRetryButton={true}
				/>
				<FeedbackPopup
					isVisible={showFeedback}
					onClose={closeFeedbackPopup}
					initialMessage="I encountered an error in Daily Challenge: No image data available"
				/>
			</>
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

			// Mark that the user has COMPLETED today's challenge (not just played)
			const today = new Date().toISOString().split("T")[0];
			localStorage.setItem("dailyChallengePlayed", today); // Set the value here

			navigate("/game-over", {
				state: { isDaily: true, score: finalScore, gameId },
			}); // Pass the final score and game ID to the Game Over page
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
						title="Daily Challenge"
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
			{/* Feedback Popup */}
			<FeedbackPopup
				isVisible={showFeedback}
				onClose={closeFeedbackPopup}
				initialMessage="I encountered an issue with the Daily Challenge"
			/>
		</div>
	);
};

export default DailyPlay;

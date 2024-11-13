import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // useRef to access the ImageContainer and Map components directly (For updating score and resetting map)
    const imageContainerRef = useRef(null);
    const mapRef = useRef(null);
    const navigate = useNavigate();

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
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []); // , [] means this effect will run only once after the initial render

    // Check for loading, error, or no data and return appropriate messages if so
    if (loading) {
        return <div>Loading...</div>;
    }
    else if (error) {
        return <div>Error: {error.message}</div>;
    }
    else if (imagesData.length === 0) {
        return <div>No images data available</div>;
    }

    // Handle the submission of coordinates and calculate the score
    const handleCoordinatesSubmit = (data) => {
        if (imagesData.length === 0 || round > imagesData.length) {
            console.error("Invalid round or imagesData not loaded");
            return;
        }

        // Set the current point lat and long to the coordinates of the image for the current round
        const currentPoint = {
            lat: imagesData[round - 1].latitude,
            lng: imagesData[round - 1].longitude,
        };

        const distanceMeters = L.latLng(data.coordinates).distanceTo(currentPoint);
        let score = 0;
        // Calculate the score based on the distance from the actual location
        if (distanceMeters < 8) {
            score = 100;
        } else if (distanceMeters <= 100) {
            score = Math.max(0, 100 - distanceMeters);
        }
        score = parseFloat(score.toFixed(2)); // Round the score to 2 decimal points
        setSubmittedData({ ...data, distance: distanceMeters, score }); // Update the submitted data to be displayed in UI
        setShowPopup(true);
        if (imageContainerRef.current) {
            imageContainerRef.current.handleScoreUpdate(score); // Update score in ImageContainer
        }
    };

    // Close the popup and navigate to the next round or end the game
    const handleClosePopup = () => {
        setShowPopup(false);
        setSubmittedData(null);
        if (round < totalRounds) { // Go to next round
            setRound(round + 1);
        } else { // Else if all rounds are completed, navigate to game over page
            const finalScore = imageContainerRef.current.getScore();
            navigate("/game-over", { state: { score: finalScore } });
        }

        // Reset the map and image container for the next round
        if (mapRef.current) {
            mapRef.current.resetMap();
        }
        if (imageContainerRef.current) {
            imageContainerRef.current.nextRound();
        }
    };

    return (
        <div className="bg-blue-100 flex flex-col h-full relative">
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-2/5 p-2 md:p-4 relative">
                    <ImageContainer
                        ref={imageContainerRef} // Allows direct access to the ImageContainer component
                        round={round}
                        setRound={setRound}
                        onScoreUpdate={handleScoreUpdate}
                        imagesData={imagesData}
                    />
                    {/* Conditionally render results popup if showPopup calls for it */}
                    {showPopup && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded shadow-lg w-3/4">
                                <h2 className="text-2xl font-bold mb-4 text-center">Result</h2>
                                <p className="text-center">
                                    Submitted Point:{" "}
                                    {/* Display coordinates if they exist else display "No coordinates submitted" */}
                                    {submittedData?.coordinates
                                        ? `${submittedData.coordinates.lat.toFixed(5)}, ${submittedData.coordinates.lng.toFixed(5)}`
                                        : "No coordinates submitted"}
                                </p>
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
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        {round === 5 ? "End Game" : "Next Round"} {/* Change button text based on round */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-3/5 p-2 md:p-4 relative">
                {/* handleCoordinatesSubmit function is passed as onCoordinatesSubmit to the Map component so it can be used in the component */}
                    <Map ref={mapRef} onCoordinatesSubmit={handleCoordinatesSubmit} imagesData={imagesData} round={round} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Play;
import React, { useEffect, useState } from "react";
import Image from "./subcomponents/Image";
import ScoreAndRound from "./subcomponents/ScoreAndRound";
import image from "../assets/228469.jpg";

const ImageContainer = () => {
	const totalRounds = 5;
	const [round, setRound] = useState(1);
	const [score, setScore] = useState(0);

	// useEffect(() => {
	// 	// Here, fetch the score from the Flask backend API for each round
	// 	// This is a placeholder for the API call
	// 	fetch(`/api/score/${round}`)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			setScore(data.score); // Assuming the API returns a score object { score: <number> }
	// 		})
	// 		.catch((error) => console.error("Error fetching score:", error));
	// }, [round]);

    useEffect(() => {
        // Directly set the score to 100
        setScore(100);
    }, [round]);

	const handleNextRound = () => {
		if (round < totalRounds) {
			setRound(round + 1);
		}
	};

	return (
		<div className="flex items-center justify-center w-full h-screen-adjusted-image-container overflow-hidden bg-gray-200">
			{/* The ImageContainer itself is now centered vertically and horizontally */}
			<div className="flex flex-col items-center p-2 w-screen">
				{/* Title above the elements */}
				<h1 className="text-4xl font-bold mb-6 text-center w-full">Campus Geoguesser</h1>

                {/* Score and Round Display */}
				<ScoreAndRound round={round} totalRounds={totalRounds} score={score} />

				{/* Image Display */}
				<div className="w-full h-full flex justify-center items-center mb-6">
					<Image src={image} alt="Interactive Image" />
				</div>
			</div>
		</div>
	);
};

export default ImageContainer;

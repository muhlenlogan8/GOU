import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import Image from "./subcomponents/Image";
import ScoreAndRound from "./subcomponents/ScoreAndRound";

const ImageContainer = forwardRef(
	({ round, imagesData, title = "Quick Play" }, ref) => {
		const totalRounds = 5;
		const [score, setScore] = useState(0);
		const [windowWidth, setWindowWidth] = useState(window.innerWidth);

		// Update windowWidth on window resize
		useEffect(() => {
			const handleResize = () => setWindowWidth(window.innerWidth);
			window.addEventListener("resize", handleResize); // Adds event listener to update windowWidth on window resize
			return () => window.removeEventListener("resize", handleResize); // Removes event listener when component unmounts to cleanup
		}, []);

		// Function to update the score
		const handleScoreUpdate = (newScore) => {
			setScore((prevScore) => {
				const updatedScore = prevScore + newScore;
				return updatedScore;
			});
		};

		// UseImperativeHandle to expose functions to parent component so they can be called directly in Play.jsx
		useImperativeHandle(ref, () => ({
			handleScoreUpdate,
			getScore() {
				return score;
			},
		}));

		// Dynamic layout adjustment based on screen size
		const isFlexRowLayout = windowWidth >= 768; // md breakpoint

		return (
			<div className="flex items-center justify-center w-full overflow-hidden">
				<div
					className={`flex flex-col ${
						isFlexRowLayout ? "md:items-start" : "items-center"
					} w-screen pr-2 pl-2`}
				>
					{/* Display ScoreAndRound for both layouts */}
					<ScoreAndRound
						round={round}
						totalRounds={totalRounds}
						score={score}
						title={title}
					/>

					{/* Display Image component */}
					<div className="w-full h-full flex justify-center items-center md:mb-2">
						{imagesData.length > 0 && (
							<Image
								src={`https://storage.googleapis.com/hackathongeoguesser/images/${
									imagesData[round - 1].image_name
								}`}
								alt="Interactive Image"
								windowWidth={windowWidth}
							/>
						)}
					</div>

					{/* Instructional Text */}
					{isFlexRowLayout && (
						<p className="text-center text-sm w-full mb-6">
							Click on the map to guess the location this image was taken
						</p>
					)}
				</div>
			</div>
		);
	}
);

export default ImageContainer;

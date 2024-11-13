import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
  } from "react";
  import { useNavigate } from "react-router-dom";
  import Image from "./subcomponents/Image";
  import ScoreAndRound from "./subcomponents/ScoreAndRound";
  
  const ImageContainer = forwardRef(
	({ round, setRound, onScoreUpdate, imagesData }, ref) => {
	  const totalRounds = 5;
	  const [score, setScore] = useState(0);
	  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	  const navigate = useNavigate();
  
	  // Update windowWidth on window resize
	  useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	  }, []);
  
	  // Function to update the score
	  const handleScoreUpdate = (newScore) => {
		setScore((prevScore) => {
		  const updatedScore = prevScore + newScore;
		  if (onScoreUpdate) onScoreUpdate(updatedScore); // Use updated score
		  return updatedScore;
		});
	  };
  
	  // UseImperativeHandle to expose functions to parent component so they can be called directly in Play.jsx
	  useImperativeHandle(ref, () => ({
		handleScoreUpdate,
		nextRound() {
		  if (round < totalRounds) {
			setRound(round + 1);
		  } else {
			navigate("/game-over", { state: { score } });
		  }
		},
		getScore() {
		  return score;
		},
	  }));
  
	  // Conditional return based on window size
	  if (windowWidth < 768) { // Smaller than 'md' breakpoint
		return (
		  <div className="flex items-center h-[40vh] justify-center w-full overflow-hidden">
			<div className="flex flex-col items-center p-1 w-screen">
			  {/* <h1 className="text-2xl font-bold mb-2 text-center w-full">
				University of Cincinnati Uni-Guesser
			  </h1> */}
			  <ScoreAndRound
				round={round}
				totalRounds={totalRounds}
				score={score}
			  />
			  <div className="w-full h-full flex justify-center items-center mb-2">
				{imagesData.length > 0 && (
				  <Image
					src={`https://storage.googleapis.com/hackathongeoguesser/images/${
					  imagesData[round - 1].image_name
					}`}
					alt="Interactive Image"
				  />
				)}
			  </div>
			  {/* <p className="font-bold text-center">
				Select on the map where you think this image was taken!
			  </p> */}
			</div>
		  </div>
		);
	  }
  
	  // Return for larger screens ('md' and above)
	  return (
		<div className="flex items-center h-screen-adjusted-image-container justify-center w-full overflow-hidden">
		  <div className="flex flex-col items-center md:p-2 w-screen">
			<h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-6 text-center w-full">
			  University of Cincinnati Uni-Guesser
			</h1>
			<ScoreAndRound
			  round={round}
			  totalRounds={totalRounds}
			  score={score}
			/>
			<div className="w-full h-full flex justify-center items-center md:mb-6">
			  {imagesData.length > 0 && (
				<Image
				  src={`https://storage.googleapis.com/hackathongeoguesser/images/${
					imagesData[round - 1].image_name
				  }`}
				  alt="Interactive Image"
				/>
			  )}
			</div>
			<p className="font-bold text-center">
			  Select on the map where you think this image was taken!
			</p>
		  </div>
		</div>
	  );
	}
  );
  
  export default ImageContainer;
  
import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import { useNavigate } from "react-router-dom";
import Image from "./subcomponents/Image";
import ScoreAndRound from "./subcomponents/ScoreAndRound";
import image from "../assets/228469.jpg";

const ImageContainer = forwardRef(({ round }, ref) => {
	const [score, setScore] = useState(0);
	const totalRounds = 5;
	const navigate = useNavigate();

	useEffect(() => {
		// Can adjust the score based on the round
	}, [round]);

	const handleScoreUpdate = (newScore) => {
		setScore((prevScore) => {
			const updatedScore = prevScore + newScore;
			return updatedScore;
		});
	};

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

	return (
		<div className="flex items-center justify-center w-full h-screen-adjusted-image-container overflow-hidden bg-gray-200">
			<div className="flex flex-col items-center p-2 w-screen">
				<h1 className="text-4xl font-bold mb-6 text-center w-full">
					Campus Geoguesser
				</h1>
				<ScoreAndRound round={round} totalRounds={totalRounds} score={score} />
				<div className="w-full h-full flex justify-center items-center mb-6">
					<Image src={image} alt="Interactive Image" />
				</div>
			</div>
		</div>
	);
});

export default ImageContainer;

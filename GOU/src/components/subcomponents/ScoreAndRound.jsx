import React from "react";

const ScoreAndRound = ({ round, totalRounds, score, title }) => {
	const formattedScore = score.toFixed(2);

	return (
		<div className="flex items-center justify-between w-full sm:m-2 bg-red">
			{/* Round Info */}
			<p className="text-xl font-bold ml-2 sm:ml-4 lg:text-2xl">
				Round {round}/{totalRounds}
			</p>

			{/* Centered Text */}
			<p className="text-xl font-extrabold text-center flex-grow sm:text-3xl mx-4">
				{title}
			</p>

			{/* Score Info */}
			<p className="text-xl font-bold mr-2 sm:mr-4 lg:text-2xl">
				Score: {formattedScore}
			</p>
		</div>
	);
};

export default ScoreAndRound;

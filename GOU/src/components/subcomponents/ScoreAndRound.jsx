import React from "react";

const ScoreAndRound = ({ round, totalRounds, score }) => {
	const formattedScore = score.toFixed(2);

	return (
		<div className="flex justify-between w-full sm:m-2">
			<p className="text-xl font-bold ml-4">
				Round {round}/{totalRounds}
			</p>
			<p className="text-xl font-bold mr-4">Score: {formattedScore}</p>
		</div>
	);
};

export default ScoreAndRound;

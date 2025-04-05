import React from "react";

const ScoreAndRound = ({ round, totalRounds, score, title }) => {
	const formattedScore = score.toFixed(2);
	const progressPercentage = (round / totalRounds) * 100;

	return (
		<div className="w-full mb-2 px-3 py-2 bg-white rounded-lg shadow-sm">
			{/* Title */}
			<div className="flex items-center justify-between mb-1">
				<h2 className="text-lg font-bold text-gray-800">{title}</h2>
				<div className="text-lg font-bold">
					<span className="text-gray-800">Score: </span>
					<span className="text-emerald-600">{formattedScore}</span>
				</div>
			</div>

			{/* Progress bar and Round indicator in same line for mobile */}
			<div className="flex items-center justify-between">
				<div className="text-xs text-gray-600 mr-2 whitespace-nowrap">
					Round {round}/{totalRounds}
				</div>
				<div className="relative h-2.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
					<div
						className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

export default ScoreAndRound;

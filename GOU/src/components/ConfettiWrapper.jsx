import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const ConfettiWrapper = ({ width, height }) => {
	const [runConfetti, setRunConfetti] = useState(true);
	const [recycleConfetti, setRecycleConfetti] = useState(true);

	useEffect(() => {
		const recycleTimeout = setTimeout(() => setRecycleConfetti(false), 5000); // Stop recycling confetti after 5 seconds
		const runTimeout = setTimeout(() => setRunConfetti(false), 8000); // Stop running confetti after 8 seconds

		return () => {
			clearTimeout(recycleTimeout);
			clearTimeout(runTimeout);
		};
	}, []);

	return (
		<Confetti
			width={width}
			height={height}
			run={runConfetti}
			recycle={recycleConfetti}
			gravity={0.3} // Confetti falling speed
		/>
	);
};

export default ConfettiWrapper;

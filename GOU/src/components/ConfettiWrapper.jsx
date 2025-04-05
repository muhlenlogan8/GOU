import React from "react";
import Confetti from "react-confetti";

const ConfettiWrapper = ({ width, height }) => {
	return (
		<div className="fixed inset-0 pointer-events-none z-20">
			<Confetti
				width={width}
				height={height * 1.2} // Extend height to ensure confetti falls completely
				recycle={false}
				numberOfPieces={300} // Increased from 200 to 300
				gravity={0.12} // Slightly reduced for slower fall
				tweenDuration={15000} // Increased for smoother animation
				initialVelocityY={5}
				colors={[
					"#3B82F6", // blue-500
					"#6366F1", // indigo-500
					"#8B5CF6", // violet-500
					"#EC4899", // pink-500
					"#10B981", // emerald-500
					"#F59E0B", // amber-500
					"#EF4444", // red-500
					"#14B8A6", // teal-500
				]}
				confettiSource={{
					x: 0,
					y: 0,
					w: width,
					h: 0,
				}}
			/>
		</div>
	);
};

export default ConfettiWrapper;

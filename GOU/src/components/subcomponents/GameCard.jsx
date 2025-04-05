import React from "react";
import { motion } from "framer-motion";

const Card = ({
	title,
	description,
	gradient,
	svgIcon,
	onClick,
	isMobile,
	className,
	disableAnimation,
}) => {
	// If animations are disabled, render a regular div instead of motion.div
	if (disableAnimation) {
		return (
			<div
				className={`relative flex flex-col rounded-lg overflow-hidden ${
					isMobile ? "w-full h-48" : "flex-1 h-56"
				} ${className || ""}`}
				onClick={onClick}
			>
				{/* Top Section: Gradient Background */}
				<div
					className={`${
						isMobile ? "h-2/5" : "h-[40%]"
					} w-full ${gradient} flex flex-col items-center justify-center p-8`}
				>
					<img
						src={svgIcon}
						alt={`${title} icon`}
						className={`${isMobile ? "w-8 h-8" : "w-10 h-10"} mb-2`}
					/>
					<h3 className="text-lg font-semibold text-white">{title}</h3>
				</div>

				{/* Bottom Section: Solid Background */}
				<div
					className={`${
						isMobile ? "h-2/3" : "h-[60%]"
					} w-full bg-n-6 flex flex-col items-center justify-center p-4`}
				>
					<p className="text-sm text-white text-center">{description}</p>
				</div>
			</div>
		);
	}

	// Default behavior with animations
	return (
		<motion.div
			className={`relative flex flex-col rounded-lg cursor-pointer overflow-hidden ${
				isMobile ? "w-full h-48" : "flex-1 h-56"
			} ${className || ""}`}
			onClick={onClick}
			whileHover={{
				scale: 1.06,
				zIndex: 10,
				boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
			}}
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			{/* Top Section: Gradient Background */}
			<div
				className={`${
					isMobile ? "h-2/5" : "h-[40%]"
				} w-full ${gradient} flex flex-col items-center justify-center p-8`}
			>
				<img
					src={svgIcon}
					alt={`${title} icon`}
					className={`${isMobile ? "w-8 h-8" : "w-10 h-10"} mb-2`}
				/>
				<h3 className="text-lg font-semibold text-white">{title}</h3>
			</div>

			{/* Bottom Section: Solid Background */}
			<div
				className={`${
					isMobile ? "h-2/3" : "h-[60%]"
				} w-full bg-n-6 flex flex-col items-center justify-center p-4 opacity-100 hover:opacity-90`}
			>
				<p className="text-sm text-white text-center">{description}</p>
			</div>
		</motion.div>
	);
};

export default Card;

import React, { useEffect, useState } from "react";

const Image = ({ src, alt }) => {
	const [scale, setScale] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

	const handleWheel = (event) => {
		event.preventDefault();
		setScale((prevScale) =>
			Math.min(Math.max(prevScale + event.deltaY * -0.001, 0.5), 3)
		);
	};

	const handleMouseDown = (event) => {
		setIsDragging(true);
		setStartPosition({
			x: event.clientX - position.x,
			y: event.clientY - position.y,
		});
	};

	const handleMouseMove = (event) => {
		if (!isDragging) return;
		setPosition({
			x: event.clientX - startPosition.x,
			y: event.clientY - startPosition.y,
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	return (
		<div
			className="relative w-full h-[650px] overflow-hidden border border-gray-300 rounded-lg"
			onWheel={handleWheel}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		>
			<img
				src={src}
				alt={alt}
				className="cursor-grab rounded-lg select-none"
				draggable="false"
				style={{
					transform: `scale(${scale}) translate(${position.x / scale}px, ${
						position.y / scale
					}px)`,
					transformOrigin: "center center",
				}}
			/>
		</div>
	);
};

export default Image;
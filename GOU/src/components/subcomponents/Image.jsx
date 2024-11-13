import React, { useState, useRef } from "react";

const Image = ({
	src,
	alt,
	magnifierHeight = 200,
	magnifierWidth = 200,
	zoomLevel = 1.5,
}) => {
	const [showMagnifier, setShowMagnifier] = useState(false);
	const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
	const [[x, y], setXY] = useState([0, 0]);
	const containerRef = useRef(null);

    // Trigger when mouse enters the image area
	const mouseEnter = (e) => {
		const el = e.currentTarget; // Get the current target element
		const { width, height } = el.getBoundingClientRect(); // Get the width and height of the image
		setSize([width, height]);
		setShowMagnifier(true);
	};

    // Trigger when mouse leaves the image area
	const mouseLeave = (e) => {
		e.preventDefault();
		setShowMagnifier(false);
	};

    // Trigger when mouse moves over the image area
	const mouseMove = (e) => {
		const el = e.currentTarget; // Get the current target element
		const { top, left } = el.getBoundingClientRect();
		const x = e.pageX - left - window.scrollX; // Get the x position of the mouse
		const y = e.pageY - top - window.scrollY; // Get the y position of the mouse
		setXY([x, y]); // Set the x and y position of the mouse
	};

	return (
		<div
			ref={containerRef}
			className="relative bg-gray-200 w-full h-full overflow-hidden border border-gray-300 rounded-lg image-container"
			onMouseEnter={mouseEnter}
			onMouseLeave={mouseLeave}
			onMouseMove={mouseMove}
		>
			<div className="relative w-full h-full overflow-hidden border border-gray-300 rounded-lg">
				<img
					src={src}
					alt={alt}
					className="cursor-default select-none rounded-lg"
					draggable="false"
				/>
                {/* Magnifier for image*/}
				<div
					style={{
						display: showMagnifier ? "" : "none",
						position: "absolute",
						pointerEvents: "none",
						height: `${magnifierHeight}px`,
						width: `${magnifierWidth}px`,
						opacity: "1",
						border: "1px solid lightgrey",
						backgroundColor: "white",
						borderRadius: "5px",
						backgroundImage: `url('${src}')`,
						backgroundRepeat: "no-repeat",
						top: `${y - magnifierHeight / 2}px`,
						left: `${x - magnifierWidth / 2}px`,
						backgroundSize: `${imgWidth * zoomLevel}px ${
							imgHeight * zoomLevel
						}px`,
						backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
						backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
					}}
				/>
			</div>
		</div>
	);
};

export default Image;

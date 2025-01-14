import React, { useState, useRef, useEffect } from "react";
import fullscreenIcon from "../../assets/fullscreen-icon.svg";
import magnifierIcon from "../../assets/magnifier-icon.svg";
import magnifierCloseIcon from "../../assets/magnifier-close-icon.svg";

const Image = ({
	src,
	alt,
	magnifierHeight = 200,
	magnifierWidth = 200,
	windowWidth,
}) => {
	const [showMagnifier, setShowMagnifier] = useState(false);
	const [magnifierEnabled, setMagnifierEnabled] = useState(false);
	const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
	const [[x, y], setXY] = useState([0, 0]);
	const [zoomLevel, setZoomLevel] = useState(1.5);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const containerRef = useRef(null);
	const isDraggingRef = useRef(false);

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 768 && !isMobileDevice());
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const disableScroll = (e) => {
			if (isDraggingRef.current && magnifierEnabled) {
				e.preventDefault();
			}
		};

		document.addEventListener("touchmove", disableScroll, { passive: false });

		return () => document.removeEventListener("touchmove", disableScroll);
	}, [magnifierEnabled]);

	const isMobileDevice = () =>
		/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

	const getMagnifierSize = () =>
		windowWidth < 600 ? [125, 125] : [magnifierHeight, magnifierWidth];
	const [dynamicHeight, dynamicWidth] = getMagnifierSize();

	const calculatePosition = (e, type) => {
		const el = containerRef.current;
		const { top, left } = el.getBoundingClientRect();
		const touch = type === "touch" ? e.touches[0] : e;
		const x = touch.pageX - left - window.scrollX;
		const y = touch.pageY - top - window.scrollY;
		setXY([x, y]);
	};

	const mouseEnter = (e) => {
		if (!magnifierEnabled) return;
		const el = e.currentTarget;
		const { width, height } = el.getBoundingClientRect();
		setSize([width, height]);
		setShowMagnifier(true);
	};

	const mouseLeave = () => setShowMagnifier(false);
	const mouseMove = (e) => calculatePosition(e, "mouse");

	const touchStart = (e) => {
		if (!magnifierEnabled) return;
		isDraggingRef.current = true; // Set dragging to true
		const el = e.currentTarget;
		const { width, height } = el.getBoundingClientRect();
		setSize([width, height]);
		setShowMagnifier(true);
		calculatePosition(e, "touch");
	};

	const touchMove = (e) => {
		if (!magnifierEnabled) return;
		calculatePosition(e, "touch");
	};

	const touchEnd = () => {
		isDraggingRef.current = false; // Set dragging to false
		setShowMagnifier(true);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleZoomChange = (e) => {
		setZoomLevel(parseFloat(e.target.value));
		if (magnifierEnabled) setShowMagnifier(true);
	};

	const toggleMagnifier = () => {
		setMagnifierEnabled(!magnifierEnabled);
		setShowMagnifier(false);
	};

	return (
		<div
			className={`relative flex items-center justify-center ${
				isSmallScreen && !isExpanded ? "h-[45vh]" : "w-full h-full"
			} transition-all duration-300`}
			ref={containerRef}
		>
			{/* Expand Button */}
			{isSmallScreen && (
				<button
					onClick={toggleExpand}
					className={`absolute top-2 right-2 z-10 flex items-center justify-end px-2 py-2 bg-n-2 rounded-full shadow-md group hover:w-auto ${
						isExpanded ? "bg-opacity-100" : "bg-opacity-70"
					}`}
				>
					<img src={fullscreenIcon} alt="Expand Icon" className="w-8 h-8" />
					<span className="ml-2 hidden group-hover:inline-block text-md text-black font-bold">
						{isExpanded ? "Collapse" : "Expand"}
					</span>
				</button>
			)}

			{/* Magnifier Toggle Button */}
			<button
				onClick={toggleMagnifier}
				className={`bg-n-2 absolute bottom-2 right-2 z-10 flex items-center justify-end px-2 py-2 rounded-full shadow-md group hover:w-auto ${
					magnifierEnabled ? "bg-opacity-100" : "bg-opacity-70"
				}`}
			>
				<img
					src={magnifierEnabled ? magnifierCloseIcon : magnifierIcon}
					alt="Magnifier Icon"
					className="w-8 h-8"
				/>
				<span className="ml-2 hidden group-hover:inline-block text-md text-black font-bold">
					{magnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"}
				</span>
			</button>

			{/* Image Container */}
			<div
				className="relative w-full h-full overflow-hidden border rounded-lg"
				onMouseEnter={mouseEnter}
				onMouseLeave={mouseLeave}
				onMouseMove={mouseMove}
				onTouchStart={touchStart}
				onTouchMove={touchMove}
				onTouchEnd={touchEnd}
			>
				<img
					src={src}
					alt={alt}
					className="object-cover w-full h-full rounded-lg cursor-default select-none"
					draggable="false"
				/>

				{/* Magnifier */}
				{magnifierEnabled && showMagnifier && (
					<div
						style={{
							position: "absolute",
							pointerEvents: "none",
							height: `${dynamicHeight}px`,
							width: `${dynamicWidth}px`,
							border: "1px solid rgba(0, 0, 0, 0.2)",
							boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
							borderRadius: "50%",
							backgroundColor: "white",
							backgroundImage: `url('${src}')`,
							backgroundRepeat: "no-repeat",
							top: `${y - dynamicHeight / 2}px`,
							left: `${x - dynamicWidth / 2}px`,
							backgroundSize: `${imgWidth * zoomLevel}px ${
								imgHeight * zoomLevel
							}px`,
							backgroundPositionX: `${-x * zoomLevel + dynamicWidth / 2}px`,
							backgroundPositionY: `${-y * zoomLevel + dynamicHeight / 2}px`,
						}}
					/>
				)}
			</div>

			{/* Zoom Level Slider */}
			{magnifierEnabled && (
				<div className="absolute bottom-2 left-2 flex justify-center items-center p-2 bg-n-6 bg-opacity-70 rounded-lg">
					<label htmlFor="zoom-slider" className="text-white mr-2">
						Zoom:
					</label>
					<input
						id="zoom-slider"
						type="range"
						min="1"
						max="3"
						step="0.1"
						value={zoomLevel}
						onChange={handleZoomChange}
						className="w-24"
					/>
				</div>
			)}
		</div>
	);
};

export default Image;

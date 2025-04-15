import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Polyline,
	Polygon,
	useMapEvents,
	Tooltip,
	Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon setup for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icons
const guessIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

const actualIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

// forwardRef to allow parent component to pass a ref to this component
const Map = forwardRef(
	({ onCoordinatesSubmit, imagesData, round, distance }, ref) => {
		const [coordinates, setCoordinates] = useState(null);
		const [showActualPoint, setShowActualPoint] = useState(false);
		const [isSubmitted, setIsSubmitted] = useState(false);
		const [windowWidth, setWindowWidth] = useState(window.innerWidth);
		const [mapCenter] = useState([39.13211, -84.5158]);
		const mapRef = useRef();

		// Get the current point for the round (Issues with passing this from Play.jsx so just passing imagesData and setting as different variable)
		const currentPoint =
			imagesData.length > 0
				? {
						lat: imagesData[round - 1].latitude,
						lng: imagesData[round - 1].longitude,
				  }
				: null;

		// Update windowWidth on window resize
		useEffect(() => {
			const handleResize = () => {
				setWindowWidth(window.innerWidth);
			};
			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, []);

		// Update the map view to the submitted coordinates
		useEffect(() => {
			if (showActualPoint && mapRef.current) {
				const map = mapRef.current;

				// Get bounds that include both markers
				if (coordinates && currentPoint) {
					const bounds = L.latLngBounds([coordinates, currentPoint]);
					map.fitBounds(bounds, { padding: [50, 50] });
				}
			}
		}, [showActualPoint, coordinates, currentPoint]);

		// Expose resetMap function to parent component
		useImperativeHandle(ref, () => ({
			resetMap() {
				setCoordinates(null);
				setShowActualPoint(false);
				setIsSubmitted(false); // Reset submission status

				// Reset map to the center or set new zoom level based on the window width
				if (mapRef.current) {
					const map = mapRef.current;
					const defaultZoom = windowWidth < 768 ? 15 : 16; // More zoomed out for smaller screens
					map.setView(mapCenter, defaultZoom); // Reset the map view with dynamic zoom level
				}
			},
		}));

		// LocationMarker component to handle the marker on the map
		const LocationMarker = () => {
			useMapEvents({
				click(e) {
					// Only allow marker movement if the guess hasn't been submitted
					if (!isSubmitted) {
						setCoordinates(e.latlng);
					}
				},
			});
			return coordinates ? (
				<Marker position={coordinates} icon={guessIcon} />
			) : null;
		};

		// Handle the submission of coordinates
		const handleSubmit = () => {
			if (coordinates && onCoordinatesSubmit && currentPoint) {
				// Check if the selected point is within the allowed area and alert if not
				if (!polylineBounds.contains(coordinates)) {
					alert("Your guess is outside the allowed area. Please try again.");
					return;
				}
				const distanceMeters = L.latLng(coordinates).distanceTo(currentPoint);
				// Call the onCoordinatesSubmit function passed from the parent component
				onCoordinatesSubmit({
					coordinates: coordinates,
					distance: distanceMeters.toFixed(2),
				});
				setShowActualPoint(true); // Ensure this updates the state
				setIsSubmitted(true); // Disable further submissions and marker movement
			} else if (!coordinates) {
				alert("Please place a marker on the map to make your guess!");
			} else {
				console.error("coordinates or currentPoint is undefined");
			}
		};

		// Boundaries for UC campus area
		const top_left = [39.135918, -84.519845];
		const top_right = [39.135287, -84.511129];
		const bottom_left = [39.128686, -84.520586];
		const bottom_right = [39.128115, -84.511767];
		const polylineBounds = L.latLngBounds([
			top_left,
			top_right,
			bottom_right,
			bottom_left,
		]);

		// Coordinates for the shaded areas outside the campus boundaries
		const shadeCoordinates = [
			{
				positions: [
					[39.13598, -84.53], // Extended point above and to the left
					top_left,
					bottom_left,
					[39.0875, -94.53], // Extended point below and to the left
				],
			},
			{
				positions: [
					[49.14, -84.51112], // Extended point above and to the right
					top_right,
					bottom_right,
					[39.1275, -70.51], // Extended point below and to the right
				],
			},
			{
				positions: [
					[39.1399883, -85.53], // Extended point to the top left of the area
					[49.14, -84.51], // Extended point to the top right of the area
					top_right,
					top_left,
				],
			},
			{
				positions: [
					bottom_left,
					bottom_right,
					[39.1275, -74.51], // Extended point below and to the right
					[39.0083, -120.53], // Extended point below and to the left
				],
			},
		];

		return (
			<div className="w-full h-full flex flex-col">
				<div
					className="flex-1 relative w-full"
					style={{
						minHeight: windowWidth < 768 ? "200px" : "300px",
						height: windowWidth < 768 ? "33vh" : "100%",
					}}
				>
					<MapContainer
						center={mapCenter}
						zoom={windowWidth < 768 ? 15 : 16}
						minZoom={windowWidth < 768 ? 14 : 15}
						maxBounds={[
							[39.125, -84.525],
							[39.14, -84.507],
						]}
						ref={mapRef}
						className="w-full h-full"
						style={{
							height: "100%",
							minHeight: windowWidth < 768 ? "200px" : "300px",
							zIndex: 1, // Ensure the map has a lower z-index
						}}
						scrollWheelZoom={true}
					>
						{/* Leaflet map component */}
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<LocationMarker />

						{/* Add Marker and line if user submits coordinates for the round */}
						{showActualPoint && coordinates && currentPoint && (
							<>
								<Marker position={currentPoint} icon={actualIcon}></Marker>
								<Polyline
									positions={[coordinates, currentPoint]}
									color="#3B82F6"
									weight={3}
									dashArray="5, 10"
								/>
								<Circle
									center={currentPoint}
									radius={10}
									color="#3B82F6"
									fillOpacity={0.3}
								/>
							</>
						)}

						{/* Boundary line around campus */}
						<Polyline
							positions={[
								top_left,
								top_right,
								bottom_right,
								bottom_left,
								top_left,
							]}
							color="#3B82F6"
							dashArray="5, 10"
							weight={3}
						/>

						{/* Polygons of gray around campus */}
						{shadeCoordinates.map((shade, index) => (
							<Polygon
								key={index}
								positions={shade.positions}
								color={null}
								fillColor="rgba(107, 114, 128, 0.7)" // Gray with transparency
								fillOpacity={0.7}
								opacity={0}
							/>
						))}
					</MapContainer>
				</div>

				{/* Submit coordinates button */}
				<div className="p-2">
					<button
						onClick={handleSubmit}
						className={`w-full py-2 rounded-md font-medium text-sm shadow-sm transition-all focus:outline-none ${
							isSubmitted
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: coordinates
								? "bg-green-500 text-white hover:bg-green-600"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
						disabled={isSubmitted || !coordinates} // Disable button when submitted or no coordinates
					>
						{coordinates ? "Submit Guess!" : "Click on map to place marker"}
					</button>
				</div>
			</div>
		);
	}
);

export default Map;

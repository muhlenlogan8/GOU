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

// forwardRef to allow parent component to pass a ref to this component
const Map = forwardRef(({ onCoordinatesSubmit, imagesData, round }, ref) => {
	const [coordinates, setCoordinates] = useState(null);
	const [distance, setDistance] = useState(null);
	const [showActualPoint, setShowActualPoint] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
			map.setView(coordinates, 16); // Zoom in to the submitted coordinates
		}
	}, [showActualPoint, coordinates]); // Run whenever `showActualPoint` or `coordinates` changes

	// Expose resetMap function to parent component
	useImperativeHandle(ref, () => ({
		resetMap() {
			setCoordinates(null);
			setDistance(null);
			setShowActualPoint(false);
			// Reset map to the center or set new currentPoint for the next round
			if (mapRef.current) {
				const map = mapRef.current;
				map.setView([39.13211, -84.5158], 16); // Reset the map view
			}
		},
	}));

	// LocationMarker component to handle the marker on the map
	const LocationMarker = () => {
		useMapEvents({
			click(e) {
				setCoordinates(e.latlng);
				if (currentPoint) {
					const distanceMeters = L.latLng(e.latlng).distanceTo(currentPoint);
					setDistance(distanceMeters.toFixed(2));
				} else {
					console.error("currentPoint is undefined");
				}
			},
		});
		return coordinates ? <Marker position={coordinates} /> : null;
	};

	// Handle the submission of coordinates
	const handleSubmit = () => {
		if (coordinates && onCoordinatesSubmit && currentPoint) {
			const polylineBounds = L.latLngBounds([
				top_left,
				top_right,
				bottom_right,
				bottom_left,
			]);
			// Check if the selected point is within the allowed area and alert if not
			if (!polylineBounds.contains(coordinates)) {
				alert("Selected point is outside the allowed area.");
				return;
			}
			const distanceMeters = L.latLng(coordinates).distanceTo(currentPoint);
			// Call the onCoordinatesSubmit function passed from the parent component
			onCoordinatesSubmit({
				coordinates: coordinates,
				distance: distanceMeters.toFixed(2),
			});
			setShowActualPoint(true); // Ensure this updates the state
		} else {
			console.error("coordinates or currentPoint is undefined");
		}
	};

	// Boundaries for UC campus area
	const top_left = [39.135918, -84.519845];
	const top_right = [39.135287, -84.511129];
	const bottom_left = [39.128686, -84.520586];
	const bottom_right = [39.128115, -84.511767];

	// Coordinates for the shaded areas outside the campus boundaries
	const left_shade_coordinates = [
		[39.13598, -84.53], // Extended point above and to the left
		top_left,
		bottom_left,
		[39.1275, -94.53], // Extended point below and to the left
	];
	const right_shade_coordinates = [
		[49.14, -84.51112], // Extended point above and to the right
		top_right,
		bottom_right,
		[39.1275, -70.51], // Extended point below and to the right
	];
	const top_shade_coordinates = [
		[39.1399883, -85.53], // Extended point to the top left of the area
		[49.14, -84.51], // Extended point to the top right of the area
		top_right,
		top_left,
	];
	const bottom_shade_coordinates = [
		bottom_left,
		bottom_right,
		[39.1275, -74.51], // Extended point below and to the right
		[39.1083, -120.53], // Extended point below and to the left
	];

	// Conditional return based on window size
	if (windowWidth < 768) { // Smaller than 'md' breakpoint
		return (
			<div className="w-full h-[45vh] p-1 flex flex-col">
				<MapContainer
					center={[39.13211, -84.5158]}
					zoom={15}
					minZoom={15}
					maxBounds={[
						[39.125, -84.525],
						[39.14, -84.507],
					]}
					ref={mapRef}
					className="w-full h-full"
					scrollWheelZoom={true}
				>
					{/* Leaflet map component */}
					<TileLayer
						url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}"
						attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						ext="jpg"
					/>
					<LocationMarker />
					{/* Add Marker and line if user submits coordinates for the round */}
					{showActualPoint && coordinates && currentPoint && (
						<>
							<Marker
								position={currentPoint}
								icon={L.divIcon({
									className: "bg-red-500 rounded-full w-4 h-4",
								})}
							/>
							<Polyline positions={[coordinates, currentPoint]} color="red" />
						</>
					)}
					{/* Dotted line around campus */}
					<Polyline
						positions={[
							top_left,
							top_right,
							bottom_right,
							bottom_left,
							top_left,
						]}
						color="blue"
						dashArray="5, 10"
					/>
					{/* Polygons of gray around campus */}
					<Polygon
						positions={left_shade_coordinates}
						color={null}
						fillColor="gray"
						fillOpacity={0.7}
						opacity={0}
					/>
					<Polygon
						positions={right_shade_coordinates}
						color={null}
						fillColor="gray"
						fillOpacity={0.7}
						opacity={0}
					/>
					<Polygon
						positions={top_shade_coordinates}
						color={null}
						fillColor="gray"
						fillOpacity={0.7}
						opacity={0}
					/>
					<Polygon
						positions={bottom_shade_coordinates}
						color={null}
						fillColor="gray"
						fillOpacity={0.7}
						opacity={0}
					/>
				</MapContainer>
				{/* Submit coordinates button */}
				<button
					onClick={handleSubmit}
					className="mt-2 w-full py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none"
				>
					Submit Coordinates
				</button>
			</div>
		);
	}

	// Return for larger screens ('md' and above)
	return (
		<div className="w-full h-full p-3 flex flex-col">
			{/* MapContainer with more zoom in for larger screens */}
			<MapContainer
				center={[39.13211, -84.5158]}
				zoom={16}
				minZoom={16}
				maxBounds={[
					[39.125, -84.525],
					[39.14, -84.507],
				]}
				ref={mapRef}
				className="w-full h-full"
				scrollWheelZoom={true}
			>
				{/* Leaflet map component */}
				<TileLayer
					url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}"
					attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					ext="jpg"
				/>
				<LocationMarker />
				{/* Add Marker and line if user submits coordinates for the round */}
				{showActualPoint && coordinates && currentPoint && (
					<>
						<Marker
							position={currentPoint}
							icon={L.divIcon({ className: "bg-red-500 rounded-full w-4 h-4" })}
						/>
						<Polyline positions={[coordinates, currentPoint]} color="red" />
					</>
				)}
				{/* Polygons of gray around campus */}
				<Polyline
					positions={[top_left, top_right, bottom_right, bottom_left, top_left]}
					color="blue"
					dashArray="5, 10"
				/>
				{/* Polygons of gray around campus */}
				<Polygon
					positions={left_shade_coordinates}
					color={null}
					fillColor="gray"
					fillOpacity={0.7}
					opacity={0}
				/>
				<Polygon
					positions={right_shade_coordinates}
					color={null}
					fillColor="gray"
					fillOpacity={0.7}
					opacity={0}
				/>
				<Polygon
					positions={top_shade_coordinates}
					color={null}
					fillColor="gray"
					fillOpacity={0.7}
					opacity={0}
				/>
				<Polygon
					positions={bottom_shade_coordinates}
					color={null}
					fillColor="gray"
					fillOpacity={0.7}
					opacity={0}
				/>
			</MapContainer>
			{/* Submit coordinates button */}
			<button
				onClick={handleSubmit}
				className="mt-2 w-full py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none"
			>
				Submit Coordinates
			</button>
		</div>
	);
});

export default Map;

import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Polyline,
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

const Map = forwardRef(({ onCoordinatesSubmit, actualPoint, round }, ref) => {
	const [coordinates, setCoordinates] = useState(null);
	const [distance, setDistance] = useState(null);
	const [showActualPoint, setShowActualPoint] = useState(false);
	const mapRef = useRef();

	useImperativeHandle(ref, () => ({
		resetMap() {
			setCoordinates(null);
			setDistance(null);
			setShowActualPoint(false);
			// Reset map to the center or set new actualPoint for the next round
			if (mapRef.current) {
				const map = mapRef.current;
				map.setView([39.13211, -84.5158], 16); // Reset the map view
			}
		},
	}));

	const LocationMarker = () => {
		useMapEvents({
			click(e) {
				setCoordinates(e.latlng);
				const distanceMeters = L.latLng(e.latlng).distanceTo(actualPoint);
				setDistance(distanceMeters.toFixed(2));
			},
		});
		return coordinates ? <Marker position={coordinates} /> : null;
	};

	const handleSubmit = () => {
		if (coordinates && onCoordinatesSubmit) {
			const distanceMeters = L.latLng(coordinates).distanceTo(actualPoint);
			const score = Math.max(0, 100 - distanceMeters / 10);
			onCoordinatesSubmit({
				coordinates: coordinates,
				distance: distanceMeters.toFixed(2),
			});
			setShowActualPoint(true);
		}
	};

	return (
		<div className="w-full h-full p-3 bg-gray-200 flex flex-col">
			<MapContainer
				center={[39.13211, -84.5158]}
				zoom={16}
				ref={mapRef}
				className="w-full h-full"
				scrollWheelZoom={true}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				<LocationMarker />
				{showActualPoint && (
					<>
						<Marker
							position={actualPoint}
							icon={L.divIcon({ className: "bg-red-500 rounded-full w-4 h-4" })}
						/>
						<Polyline positions={[coordinates, actualPoint]} color="red" />
					</>
				)}
			</MapContainer>
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

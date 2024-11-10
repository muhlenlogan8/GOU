import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

const Map = ({ onCoordinatesSubmit }) => {
	const [coordinates, setCoordinates] = useState(null);

	const LocationMarker = () => {
		useMapEvents({
			click(e) {
				setCoordinates(e.latlng);
			},
		});
		return coordinates ? <Marker position={coordinates} /> : null;
	};

	const handleSubmit = () => {
		if (coordinates && onCoordinatesSubmit) {
			onCoordinatesSubmit(coordinates);
		}
	};

	return (
		<div className="w-full h-full p-3 bg-gray-200 flex flex-col">
			<div className="flex-grow">
				<MapContainer
					center={[39.13211, -84.5158]}
					maxBounds={[
						[39.125, -84.525],
						[39.14, -84.507],
					]}
					zoom={16}
					minZoom={16}
					className="w-full h-full"
					scrollWheelZoom={true}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
					/>
					<LocationMarker />
				</MapContainer>
			</div>
			<button
				onClick={handleSubmit}
				className="mt-2 w-full py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none"
			>
				Submit Coordinates
			</button>
		</div>
	);
};

export default Map;

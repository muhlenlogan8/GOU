import React, { useState } from "react";
import ImageContainer from "../components/ImageContainer";
import Map from "../components/Map";
import Footer from "../components/Footer";

const Play = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);

	const actualPoint = { lat: 39.13211, lng: -84.5158 };

	const handleCoordinatesSubmit = (data) => {
		setSubmittedData(data);
		setShowPopup(true);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
		setSubmittedData(null);
	};

	return (
		<div className="flex flex-col h-full relative">
			<div className="flex-grow flex overflow-hidden">
				<div className="w-2/5 p-4 relative">
					<ImageContainer />
					{showPopup && (
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-8 rounded shadow-lg w-3/4">
								<h2 className="text-2xl font-bold mb-4">Result</h2>
								<p>Submitted Point: {`${submittedData.coordinates.lat.toFixed(5)}, ${submittedData.coordinates.lng.toFixed(5)}`}</p>
								<p>Distance from actual location: {submittedData.distance} meters</p>
								<button
									onClick={handleClosePopup}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Next Round
								</button>
							</div>
						</div>
					)}
				</div>
				<div className="w-3/5 p-4">
					<Map onCoordinatesSubmit={handleCoordinatesSubmit} actualPoint={actualPoint} />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Play;




import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon setup for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Map = ({ onCoordinatesSubmit, actualPoint }) => {
	const [coordinates, setCoordinates] = useState(null);
	const [distance, setDistance] = useState(null);
	const [showActualPoint, setShowActualPoint] = useState(false);
	const mapRef = useRef();

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
			onCoordinatesSubmit({ coordinates, distance });
			setShowActualPoint(true);
			fitBoundsToPoints();
		}
	};

	const fitBoundsToPoints = () => {
		if (mapRef.current && coordinates) {
			const map = mapRef.current;
			const bounds = L.latLngBounds([coordinates, actualPoint]);
			map.fitBounds(bounds, { padding: [50, 50] });
		}
	};

	return (
		<div className="w-full h-full p-3 bg-gray-200 flex flex-col">
			<div className="flex-grow relative">
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
							<Marker position={actualPoint} icon={L.divIcon({ className: 'bg-red-500 rounded-full w-4 h-4' })} />
							<Polyline positions={[coordinates, actualPoint]} color="red" />
						</>
					)}
				</MapContainer>
				{distance && (
					<div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
						<p>Distance: {distance} meters</p>
					</div>
				)}
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
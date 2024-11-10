import Header from "../components/Header";
import Image from "../components/Image";
import Map from "../components/Map";
import Footer from "../components/Footer";
import image from "../assets/228469.jpg";
import mapImage from "../assets/228469.jpg";

const Play = () => {
	const handleCoordinatesSubmit = (coords) => {
		console.log("Submitted Coordinates:", coords);
	};

	return (
		<>
			<Header />
			<Image src={image} alt="Description of the image" />
			<Map mapSrc={mapImage} onCoordinatesSubmit={handleCoordinatesSubmit} />
            <Footer />
		</>
	);
};

export default Play;

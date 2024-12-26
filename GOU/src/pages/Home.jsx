import HomeHeader from "../components/HomeHeader";
import Hero from "../components/Hero";
import Mission from "../components/Mission";
import Leaderboard from "../components/Leaderboard";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

const LandingPage = () => {
	return (
		<>
			<HomeHeader />
			<Hero />
			<Leaderboard />
			{/* <Mission /> */}
			<Testimonial />
			<Footer />
		</>
	);
};

export default LandingPage;

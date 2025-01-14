import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";
import DailyPlay from "./pages/DailyPlay";
import GameOver from "./pages/GameOver";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/quick-play" element={<Play />} />
			<Route path="/daily-challenge" element={<DailyPlay />} />
			<Route path="/game-over" element={<GameOver />} />
		</Routes>
	);
};

export default App;

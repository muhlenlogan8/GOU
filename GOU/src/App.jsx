import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";
import GameOver from "./pages/GameOver";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/play" element={<Play />} />
			<Route path="/game-over" element={<GameOver />} />
		</Routes>
	);
};

export default App;

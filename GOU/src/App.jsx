import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";
import GameOver from "./pages/GameOver";
import Test from "./pages/Test";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/play" element={<Play />} />
			<Route path="game-over" element={<GameOver />} />
			{/* <Route path="test" element={<Test />} /> */}
		</Routes>
	);
};

export default App;
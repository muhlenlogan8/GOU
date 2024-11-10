import { useNavigate } from "react-router-dom";

const GameOver = ({ finalScore }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
      <p className="text-lg">Thank you for playing!</p>
      <p className="text-xl">Final Score: {finalScore}</p>
      <button
        onClick={() => navigate("/play")} // Navigate to /play on button press
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;

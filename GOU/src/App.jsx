import { useEffect, useState } from "react";

function App() {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch("/api/data")
			.then((response) => response.json())
			.then((data) => setData(data.message));
	}, []);

	return (
		<div className="text-center">
			<h1 className="text-2xl font-bold">Welcome</h1>
			{data && <p>{data}</p>}
		</div>
	);
}

export default App;

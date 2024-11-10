import React, { useEffect, useState } from "react";

const Test = () => {
    const [imagesData, setImagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/data")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setImagesData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Images Data</h1>
            <ul>
                {imagesData.map((image, index) => (
                    <li key={index}>
                        <p>Image Name: {image.image_name}</p>
                        <p>Latitude: {image.latitude}</p>
                        <p>Longitude: {image.longitude}</p>
                        <img
                            src={`https://storage.googleapis.com/hackathongeoguesser/images/${image.image_name}`}
                            alt={`Image ${index + 1}`}
                            style={{ maxWidth: "100%", height: "auto" }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Test;
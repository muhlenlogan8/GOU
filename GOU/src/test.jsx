import React, { useState, useEffect } from 'react';

const ImageDisplay = () => {
  const [data, setData] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/image_data')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log('Fetched data:', jsonData);  // Log the fetched data
        setData(jsonData);  // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // Log any fetch errors
      });
  }, []);

  const handleImageError = () => {
    setImageError(true);  // Handle image error if the image doesn't load
  };

  if (!data) {
    return <div>Loading...</div>;  // Show loading message while data is being fetched
  }

  return (
    <div>
      <h1>Image Gallery</h1>
      {data.map((imageData, index) => (
        <div key={index}>
          {imageError ? (
            <div>
              <p>Image failed to load. Please try again later.</p>
              <img
                src="/path/to/fallback-image.jpg"  // A fallback image if the original fails
                alt="Fallback"
                style={{ width: '300px', height: 'auto' }}
              />
            </div>
          ) : (
            <div>
              <img
                src={imageData.image}  // Use the image URL from the JSON response
                alt={`Image ${index + 1}`}
                onError={handleImageError}  // Trigger imageError if the image doesn't load
                style={{ width: '300px', height: 'auto' }}
              />
              <div>
                <p>Filename: {imageData.filename}</p>  {/* Display the filename */}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageDisplay;

// import { useEffect, useState } from "react";

// function App() {
// 	const [data, setData] = useState(null);

// 	useEffect(() => {
// 		fetch("/api/data")
// 			.then((response) => response.json())
// 			.then((data) => setData(data.message));
// 	}, []);

// 	return (
// 		<div className="text-center">
// 			<h1 className="text-2xl font-bold">Welcome</h1>
// 			{data && <p>{data}</p>}
// 		</div>
// 	);
// }

// export default App;

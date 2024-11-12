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


{/* 2x1 Grid for Mission Cards */}
<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
{/* Education Card */}
<div className="bg-white p-6 rounded-lg shadow-lg">
  <div className="flex items-center justify-start gap-6">
    {/* Larger Icon */}
    <FaBrain className="text-9xl text-pink-600" />
    <div className="flex flex-col justify-center">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900">
        Transforming Education
      </h3>
      {/* Description */}
      <p className="mt-4 text-gray-700">
        Uni-Guesser enhances the student learning experience by
        introducing campus resources. It helps students discover new
        academic and mental health resources through interactive and
        immersive gameplay.
      </p>
    </div>
  </div>
</div>

{/* Social Issues Card */}
<div className="bg-white p-6 rounded-lg shadow-lg">
  <div className="flex items-center justify-start gap-6">
    {/* New Icon for Social Issues */}
    <FaHandsHelping className="text-9xl text-green-600" />
    <div className="flex flex-col justify-center">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900">
        Addressing Social Issues
      </h3>
      {/* Description */}
      <p className="mt-4 text-gray-700">
        Uni-Guesser encourages students to compete with others on their
        knowledge of various campus locations, leading to exploration.
        Overall, it fosters a more connected and supportive university
        environment.
      </p>
    </div>
  </div>
</div>
</div>
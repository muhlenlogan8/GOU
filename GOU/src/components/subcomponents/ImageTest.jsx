import React, { useState, useEffect, useRef } from "react";

const Image = ({ src, alt }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = (event) => {
        event.preventDefault();
        setScale((prevScale) => {
            const newScale = Math.min(Math.max(prevScale + event.deltaY * -0.001, 1), 2.5);
            return newScale;
        });
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setStartPosition({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            setPosition({
                x: event.clientX - startPosition.x,
                y: event.clientY - startPosition.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative bg-gray-200 w-full h-full overflow-hidden border border-gray-300 rounded-lg image-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="relative w-full h-full overflow-hidden border border-gray-300 rounded-lg">
                <img
                    src={src}
                    alt={alt}
                    className="cursor-grab select-none rounded-lg"
                    draggable="false"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    }}
                />
            </div>
        </div>
    );
};

export default Image;
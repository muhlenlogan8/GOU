import React, { useState, useEffect, useRef } from "react";

const Image = ({ src, alt, magnifierHeight = 200, magnifierWidth = 200, zoomLevel = 1.5 }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [[x, y], setXY] = useState([0, 0]);
    const containerRef = useRef(null);

    const mouseEnter = (e) => {
        const el = e.currentTarget;
        const { width, height } = el.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
    };

    const mouseLeave = (e) => {
        e.preventDefault();
        setShowMagnifier(false);
    };

    const mouseMove = (e) => {
        const el = e.currentTarget;
        const { top, left } = el.getBoundingClientRect();
        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;
        setXY([x, y]);
    };

    return (
        <div
            ref={containerRef}
            className="relative bg-gray-200 w-full h-full overflow-hidden border border-gray-300 rounded-lg image-container"
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onMouseMove={mouseMove}
        >
            <div className="relative w-full h-full overflow-hidden border border-gray-300 rounded-lg">
                <img
                    src={src}
                    alt={alt}
                    className="cursor-default select-none rounded-lg"
                    draggable="false"
                />
                <div
                    style={{
                        display: showMagnifier ? '' : 'none',
                        position: 'absolute',
                        pointerEvents: 'none',
                        height: `${magnifierHeight}px`,
                        width: `${magnifierWidth}px`,
                        opacity: '1',
                        border: '1px solid lightgrey',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: 'no-repeat',
                        top: `${y - magnifierHeight / 2}px`,
                        left: `${x - magnifierWidth / 2}px`,
                        backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                        backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                        backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                    }}
                />
            </div>
        </div>
    );
};

export default Image;
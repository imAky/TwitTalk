import React from "react";

const AnimateSVG = ({ width, height, swidth }) => {
  const animationStyles = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes dash {
      0% {
        stroke-dashoffset: 128;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
  `;

  const svgStyle = {
    animation: "spin 2s linear infinite", // adjust animation duration or timing function as needed
  };

  const secondCircleStyle = {
    animation: "dash 1.5s ease-in-out forwards",
    animationDelay: "0.5s", // delay the start of this animation if needed
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
    >
      <style>{animationStyles}</style>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#f3f3f3"
        strokeWidth={swidth}
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#3498db"
        strokeWidth={swidth}
        strokeLinecap="round"
        strokeDasharray="128"
        transform="rotate(-90 50, 50)"
        fill="none"
        strokeDashoffset="128"
        style={secondCircleStyle}
      />
    </svg>
  );
};

export default AnimateSVG;

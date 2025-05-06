import React, { useState } from "react";
import { Link } from "react-router-dom";

const Cal = ({ src, alt = "Image", className = "" }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle size on click
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Link to="/cal">
        <img
          src={src}
          alt={alt}
          className={`w-[300px] h-[300px] object-cover ml-7 rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105 ring-10 ring-gray-200 ${
            isClicked ? "scale-150" : "scale-100"
          } ${className}`}
          onClick={handleClick}
        />
      </Link>
    </div>
  );
};

export default Cal;

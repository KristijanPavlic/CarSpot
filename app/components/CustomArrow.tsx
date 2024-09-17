import React from "react";
import ElementTile from "./ElementTile";

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const NextArrow = ({ onClick }: ArrowProps) => {
  return (
    <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-1 cursor-pointer"
      onClick={onClick}
      title="Next image"
    >
      <div className="flex justify-center items-center bg-[#212121d9] hover:bg-[#212121] rounded-full p-2 shadow-lg transition duration-300 ease-in-out">
        <div className="material-symbols-outlined h-6 w-6 text-white">
          chevron_right
        </div>
      </div>
    </div>
  );
};

export const PrevArrow = ({ onClick }: ArrowProps) => {
  return (
    <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[2] cursor-pointer"
      onClick={onClick}
      title="Previous image"
    >
      <div className="flex justify-center items-center bg-[#212121d9] hover:bg-[#212121] rounded-full p-2 shadow-lg transition duration-300 ease-in-out">
        <div className="material-symbols-outlined h-6 w-6 text-white">
          chevron_left
        </div>
      </div>
    </div>
  );
};

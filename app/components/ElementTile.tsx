import React from "react";
import "@/app/globals.css";

interface ElementTitleProps {
  icon?: string;
  content: string;
  tooltip?: string;
}

const ElementTile: React.FC<ElementTitleProps> = ({
  icon,
  content,
  tooltip,
}) => {
  return (
    <div
      className="bg-[#d9d9d9d6] w-fit rounded-lg outline outline-2 outline-[#212121] absolute top-4 right-4 hover-label cursor-default"
      data-tooltip={tooltip}
    >
      <div className="flex justify-center gap-1 p-1 text-[#212121]">
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-base">{content}</span>
      </div>
    </div>
  );
};

export default ElementTile;

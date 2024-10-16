import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}: PaginationControlsProps) => {
  return (
    <div className="flex gap-3 mb-6 mt-8 bg-[#212121] w-fit m-auto rounded-lg p-2">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`w-fit px-3 bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out rounded-md ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <div className="flex justify-center">
          <span className="material-symbols-outlined">chevron_left</span>
        </div>
      </button>
      <span className="px-2 py-2 text-[#D9D9D9]">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`w-fit px-3 bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out rounded-md ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <div className="flex justify-center">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </button>
    </div>
  );
};

export default PaginationControls;

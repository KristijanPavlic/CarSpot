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
    <div className="relative mb-4 md:grid md:grid-cols-3 flex justify-center mt-8 bg-[#212121] w-fit m-auto rounded-lg p-2">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`px-2 py-1 mx-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out rounded-md ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <div className="flex justify-center">
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="md:block hidden">Previous</span>
        </div>
      </button>
      <span className="px-2 py-2 mx-2 text-[#D9D9D9]">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-2 py-2 mx-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out rounded-md ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <div className="flex justify-center">
          <span className="md:block hidden">Next</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </button>
    </div>
  );
};

export default PaginationControls;

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import ElementTile from "./ElementTitle";

interface CarSearchProps {
  isAdmin: boolean;
  userId: string;
}

const CarSearch = ({ isAdmin, userId }: CarSearchProps) => {
  // Fetch all cars from the database
  const cars = useQuery(api.cars.get) ?? [];
  const deleteCar = useMutation(api.cars.deleteCar);

  // State for each filter
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const carsPerPage = 6; // Number of cars per page

  // State for filtered data
  const [filteredCars, setFilteredCars] = useState(cars);

  const [isFormVisible, setIsFormVisible] = useState(true); // Form visibility state
  const [isScrolled, setIsScrolled] = useState(false); // Scroll state

  // Check if the data is loading
  const isLoading = cars.length === 0;

  // Update filtered cars when brand, model, year, or location changes
  useEffect(() => {
    let filtered = cars;

    if (selectedBrand) {
      filtered = filtered.filter((car) => car.brand === selectedBrand);
    }

    if (selectedModel) {
      filtered = filtered.filter((car) => car.model === selectedModel);
    }

    if (selectedYear) {
      filtered = filtered.filter((car) => car.year === selectedYear);
    }

    if (selectedLocation) {
      filtered = filtered.filter((car) => car.location === selectedLocation);
    }

    setFilteredCars(filtered);
  }, [selectedBrand, selectedModel, selectedYear, selectedLocation, cars]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Mark as scrolled if more than 100px from top

      // Automatically show form when close to the top
      if (scrollPosition <= 100) {
        setIsFormVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Function to clear all dropdown selections
  const clearAllSelections = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedLocation("");
    setCurrentPage(1); // Reset pagination
  };

  // Pagination Logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Get unique values for the dropdowns
  const brands = [...new Set(cars.map((car) => car.brand))];
  const models = [
    ...new Set(
      cars.filter((car) => car.brand === selectedBrand).map((car) => car.model)
    ),
  ];
  const years = [
    ...new Set(
      cars
        .filter(
          (car) =>
            car.brand === selectedBrand &&
            (!selectedModel || car.model === selectedModel)
        )
        .map((car) => car.year)
    ),
  ];
  const locations = [
    ...new Set(
      cars
        .filter(
          (car) =>
            car.brand === selectedBrand &&
            (!selectedModel || car.model === selectedModel) &&
            (!selectedYear || car.year === selectedYear)
        )
        .map((car) => car.location)
    ),
  ];

  // Pagination: Number of total pages
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6">
      <div className="sticky top-2 mb-6 z-[9999] bg-[#cccccc] w-fit m-auto px-4 py-4 rounded-lg">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold mb-6 text-center">Search car</h1>
          {/* Button to show options when the form is hidden */}
          {isScrolled && !isFormVisible && (
            <button
              onClick={toggleFormVisibility}
              className="block mx-auto mb-4 p-2 bg-blue-500 text-white rounded-lg transition-all"
            >
              Show Options
            </button>
          )}
          {/* Button to hide form */}
          {isFormVisible && isScrolled && (
            <button
              onClick={toggleFormVisibility}
              className="block mx-auto mt-4 p-2 bg-red-500 text-white rounded-lg transition-all"
            >
              Hide Options
            </button>
          )}
        </div>
        <form
          className={`flex flex-wrap gap-4 justify-center transition-opacity duration-500 ${
            isFormVisible
              ? "opacity-100 h-auto"
              : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          <select
            name="brand"
            aria-label="brand"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setSelectedYear("");
              setSelectedLocation("");
              setCurrentPage(1);
            }}
            className="p-2 border rounded-md"
          >
            <option value="">Select Brand</option>
            {[...new Set(cars.map((car) => car.brand))].map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            name="model"
            aria-label="model"
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setSelectedYear("");
              setSelectedLocation("");
              setCurrentPage(1);
            }}
            disabled={!selectedBrand}
            className="p-2 border rounded-md"
          >
            <option value="">Select Model</option>
            {[
              ...new Set(
                cars
                  .filter((car) => car.brand === selectedBrand)
                  .map((car) => car.model)
              ),
            ].map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>

          <select
            name="year"
            aria-label="year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedLocation("");
              setCurrentPage(1);
            }}
            disabled={!selectedModel}
            className="p-2 border rounded-md"
          >
            <option value="">Select Year</option>
            {[
              ...new Set(
                cars
                  .filter(
                    (car) =>
                      car.brand === selectedBrand &&
                      (!selectedModel || car.model === selectedModel)
                  )
                  .map((car) => car.year)
              ),
            ].map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            name="location"
            aria-label="location"
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
            disabled={!selectedYear}
            className="p-2 border rounded-md"
          >
            <option value="">Select Location</option>
            {[
              ...new Set(
                cars
                  .filter(
                    (car) =>
                      car.brand === selectedBrand &&
                      (!selectedModel || car.model === selectedModel) &&
                      (!selectedYear || car.year === selectedYear)
                  )
                  .map((car) => car.location)
              ),
            ].map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          {/* Clear all button */}
          <button
            onClick={(e) => clearAllSelections(e)}
            className="block mx-auto mt-4 p-2 bg-yellow-500 text-black rounded-lg transition-all"
          >
            Clear All
          </button>
        </form>
      </div>

      {/* Show filtered car list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-lg">
              <div className="h-40 bg-gray-400 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-400 rounded-md mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-400 rounded-md w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filteredCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCars.map((car, index) => (
                  <div
                    className="h-fit bg-[#212121] shadow-lg rounded-lg hover:shadow-lg transition-shadow"
                    key={index}
                  >
                    <div className="relative">
                      <Image
                        src={`https://via.placeholder.com/300x200.png?text=${car.brand}+${car.model}`}
                        alt={`${car.brand} ${car.model}`}
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg"
                      />
                      <ElementTile
                        icon="imagesmode"
                        content={String(Math.floor(Math.random() * 10))}
                        tooltip="Number of images"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-2xl text-white font-bold">
                        {car.brand} {car.model}
                      </h2>
                      <p className="text-lg text-[#D9D9D9] pt-1">{car.year}</p>
                      <p className="text-lg text-[#D9D9D9] pt-4">
                        <div className="flex gap-1">
                          <span className="material-symbols-outlined">
                            pin_drop
                          </span>
                          {car.location}, Croatia
                        </div>
                      </p>
                    </div>
                    <div>
                      {(isAdmin === true || userId === car.userId) && (
                        <div className="flex gap-4 float-right pr-4 pb-4">
                          <button
                            className="block w-fit p-4 bg-[#D9D9D9] text-[#212121] rounded-lg py-2 hover:cursor-pointer hover:bg-[#ffffff] transition duration-300 ease-in-out"
                            /* onClick={() => deleteCar({ id: car._id })} */
                          >
                            <div className="flex justify-center gap-2">
                              Edit
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                            </div>
                          </button>
                          <button
                            className="block w-fit p-4 bg-[#B71C1C] text-white rounded-lg py-2 hover:cursor-pointer hover:bg-red-400 transition duration-300 ease-in-out"
                            onClick={() => {
                              const isConfirmed = window.confirm(
                                "Are you sure you want to delete this post?"
                              );
                              if (isConfirmed) {
                                deleteCar({ id: car._id });
                              }
                            }}
                          >
                            <div className="flex justify-center gap-2">
                              Delete
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {filteredCars.length > carsPerPage && (
                <div className="md:grid md:grid-cols-3 flex justify-center mt-8 bg-[#212121] w-fit m-auto rounded-lg p-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 mx-2 bg-gray-200 rounded-md ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                      <span className="md:block hidden">Previous</span>
                    </div>
                  </button>
                  <span className="px-3 py-2 mx-2 text-[#D9D9D9]">{`Page ${currentPage} of ${totalPages}`}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 mx-2 bg-gray-200 rounded-md ${
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <span className="md:block hidden">Next</span>
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center">No cars available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CarSearch;

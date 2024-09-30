"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import CarCard from "./CarCard";
import FilterForm from "./FilterForm";
import PaginationControls from "./PaginationControls";
import { Car } from "../types/types";

interface CarSearchProps {
  isAdmin: boolean;
  userId: string;
}

const CarSearch = ({ isAdmin, userId }: CarSearchProps) => {
  const queryResult = useQuery(api.cars.get);
  const cars = useMemo(() => queryResult ?? [], [queryResult]);
  const deleteCar = useMutation(api.cars.deleteCar);

  // State for each filter
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  // State for filtered data
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLoading = queryResult === undefined; // Check if cars are still loading

  // Update filtered cars when filters change
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

    if (selectedCity) {
      filtered = filtered.filter((car) => car.city === selectedCity);
    }

    if (selectedCountry) {
      filtered = filtered.filter((car) => car.country === selectedCountry);
    }

    setFilteredCars(filtered);
  }, [
    selectedBrand,
    selectedModel,
    selectedYear,
    selectedCity,
    selectedCountry,
    cars,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);

      if (scrollPosition <= 100) {
        setIsFormVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const clearAllSelections = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedCity("");
    setSelectedCountry("");
    setCurrentPage(1);
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
  const cities = [
    ...new Set(
      cars
        .filter(
          (car) =>
            car.brand === selectedBrand &&
            (!selectedModel || car.model === selectedModel) &&
            (!selectedYear || car.year === selectedYear)
        )
        .map((car) => car.city)
    ),
  ];
  const countries = [
    ...new Set(
      cars
        .filter(
          (car) =>
            car.brand === selectedBrand &&
            (!selectedModel || car.model === selectedModel) &&
            (!selectedYear || car.year === selectedYear) &&
            (!selectedCity || car.city === selectedCity)
        )
        .map((car) => car.country)
    ),
  ];

  // Pagination: Number of total pages
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="px-5 py-10">
      {isLoading ? (
        // Show loading skeleton while loading
        <>
          <div className="grid grid-cols-1 ">
            {[...Array(1)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg">
                <div className="h-36 bg-gray-400 rounded-md mb-4"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg">
                <div className="h-40 bg-gray-400 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-400 rounded-md mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-400 rounded-md w-1/4"></div>
              </div>
            ))}
          </div>
        </>
      ) : filteredCars.length >= 1 ? (
        <>
          {/* Show the filter form and cars if there are cars */}
          <div className="sticky top-2 mb-6 z-10 bg-[#cccccc] w-fit m-auto px-4 py-4 rounded-lg">
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold mb-6 text-center">
                Search Car
              </h1>
              {isScrolled && !isFormVisible && (
                <button
                  onClick={toggleFormVisibility}
                  className="block mx-auto mb-4 p-2 bg-blue-500 text-white rounded-lg transition-all"
                >
                  Show Options
                </button>
              )}
              {isFormVisible && isScrolled && (
                <button
                  onClick={toggleFormVisibility}
                  className="block mx-auto mt-4 p-2 bg-red-500 text-white rounded-lg transition-all"
                >
                  Hide Options
                </button>
              )}
            </div>
            <FilterForm
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              brands={brands}
              models={models}
              years={years}
              cities={cities}
              countries={countries}
              clearAllSelections={clearAllSelections}
              setCurrentPage={setCurrentPage}
              isFormVisible={isFormVisible}
              currentPage={currentPage}
            />
          </div>

          {/* Display cars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCars.map((car, index) => (
              <CarCard
                key={index}
                car={car}
                isAdmin={isAdmin}
                userId={userId}
                deleteCar={deleteCar}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {filteredCars.length > carsPerPage && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          )}
        </>
      ) : (
        // Display no cars found message if no cars
        <div className="text-center text-2xl font-bold mt-6">
          No cars found.
        </div>
      )}
    </div>
  );
};

export default CarSearch;

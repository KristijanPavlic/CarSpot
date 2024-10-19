import React, { useState } from "react";

interface FilterFormProps {
  selectedBrand: string;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  brands: string[];
  models: string[];
  years: string[];
  cities: string[];
  countries: string[];
  clearAllSelections: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const FilterForm = ({
  selectedBrand,
  setSelectedBrand,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  selectedCity,
  setSelectedCity,
  selectedCountry,
  setSelectedCountry,
  brands,
  models,
  years,
  cities,
  countries,
  clearAllSelections,
  setCurrentPage,
}: FilterFormProps) => {
  return (
    <form
      className={`${selectedBrand !== "" ? "xl:grid-cols-6 md:grid-cols-3 grid-cols-2" : "xl:grid-cols-5 md:grid-cols-3 grid-cols-2"} grid gap-4 lg:text-base text-sm`}
    >
      <select
        name="brand"
        aria-label="brand"
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel("");
          setSelectedYear("");
          setSelectedCity("");
          setSelectedCountry("");
          setCurrentPage(1);
        }}
        className="p-2 border rounded-md"
      >
        <option value="">Select Brand</option>
        {brands.map((brand, index) => (
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
          setSelectedCity("");
          setSelectedCountry("");
          setCurrentPage(1);
        }}
        disabled={!selectedBrand}
        className="p-2 border rounded-md"
      >
        <option value="">Select Model</option>
        {models.map((model, index) => (
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
          setSelectedCity("");
          setSelectedCountry("");
          setCurrentPage(1);
        }}
        disabled={!selectedModel}
        className="p-2 border rounded-md"
      >
        <option value="">Select Year</option>
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        name="city"
        aria-label="city"
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          setSelectedCountry("");
          setCurrentPage(1);
        }}
        disabled={!selectedYear}
        className="p-2 border rounded-md"
      >
        <option value="">Select City</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>

      <select
        name="country"
        aria-label="country"
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setCurrentPage(1);
        }}
        disabled={!selectedCity}
        className="p-2 border rounded-md"
      >
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      {/* Clear all button */}
      {selectedBrand !== "" && (
        <button
          onClick={clearAllSelections}
          className={`block p-2 bg-yellow-500 text-[#212121] rounded-lg hover:bg-yellow-600 hover:cursor-pointer transition duration-300 ease-in-out`}
        >
          Clear filters
        </button>
      )}
    </form>
  );
};

export default FilterForm;

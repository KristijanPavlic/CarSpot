"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: string;
  city: string;
  country: string;
  userId: string;
  username: string;
  imagePublicIds: string[];
  postId: string;
}

interface CarWithCoordinates extends Car {
  latitude?: number;
  longitude?: number;
}

interface MapDataContextType {
  carsWithCoords: CarWithCoordinates[];
  loading: boolean;
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export const useMapData = () => {
  const context = useContext(MapDataContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapDataProvider");
  }
  return context;
};

export const MapDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cars = useQuery(api.cars.get); // Fetch all cars
  const [carsWithCoords, setCarsWithCoords] = useState<CarWithCoordinates[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [geocodeCache, setGeocodeCache] = useState<
    Record<string, [number, number] | null>
  >({});

  useEffect(() => {
    const fetchCoordinatesForCars = async () => {
      if (!cars) return;

      const updatedCars: CarWithCoordinates[] = [];
      const uniqueQueries = new Set<string>();

      // Collect unique city-country combinations
      cars.forEach((car) => {
        const query = `${car.city},${car.country}`;
        uniqueQueries.add(query);
      });

      // Prepare a cache to store geocoded results
      const cache: Record<string, [number, number] | null> = {
        ...geocodeCache,
      };

      // Geocode unique queries
      for (const query of uniqueQueries) {
        if (cache[query] === undefined) {
          // Delay to respect rate limiting (1 request per second)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          try {
            const response = await fetch(
              `/api/geocode?query=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data && data.lat && data.lng) {
              cache[query] = [data.lat, data.lng];
            } else {
              console.error(`No results found for ${query}`);
              cache[query] = null; // Record that no result was found
            }
          } catch (error) {
            console.error("Error fetching coordinates:", error);
            cache[query] = null; // Record that an error occurred
          }
        }
      }

      // Update geocode cache state
      setGeocodeCache(cache);

      // Map cars to include coordinates
      for (const car of cars) {
        const query = `${car.city},${car.country}`;
        if (cache[query]) {
          const [lat, lng] = cache[query]!;

          updatedCars.push({
            ...car,
            latitude: lat,
            longitude: lng,
          });
        }
      }

      // Update state with cars that have coordinates
      setCarsWithCoords(updatedCars);
      setLoading(false);
    };

    fetchCoordinatesForCars();
  }, [cars]);

  return (
    <MapDataContext.Provider value={{ carsWithCoords, loading }}>
      {children}
    </MapDataContext.Provider>
  );
};

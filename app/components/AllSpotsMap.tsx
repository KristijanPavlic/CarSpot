// components/AllSpotsMap.tsx

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import MarkerClusterGroup from "react-leaflet-cluster";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

const AllSpotsMap = () => {
  const cars = useQuery(api.cars.get); // Fetch all cars
  const [carsWithCoords, setCarsWithCoords] = useState<CarWithCoordinates[]>(
    []
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // Default center
  const [loading, setLoading] = useState(true);
  const [geocodeCache, setGeocodeCache] = useState<
    Record<string, [number, number] | null>
  >({});

  const openCageApiKey = "e5cb5936c89c459ca2d75589b71b8e64"; // Replace with your API key

  useEffect(() => {
    if (cars) {
      const fetchCoordinatesForCars = async () => {
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
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                  query
                )}&key=${openCageApiKey}`
              );
              const data = await response.json();
              if (data && data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                cache[query] = [lat, lng];
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

        // Adjust the map center to the first car's coordinates if available
        if (updatedCars.length > 0) {
          setMapCenter([updatedCars[0].latitude!, updatedCars[0].longitude!]);
        }

        setLoading(false);
      };

      fetchCoordinatesForCars();
    }
  }, [cars]);

  return (
    <div className="mt-4 h-[80vh]">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#BBD01A]"></div>
        </div>
      ) : carsWithCoords.length > 0 ? (
        <MapContainer
          center={mapCenter}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {carsWithCoords.map((car) => (
              <Marker key={car._id} position={[car.latitude!, car.longitude!]}>
                <Popup>
                  {car.brand} {car.model} ({car.year})<br />
                  {car.city}, {car.country} <br />
                  <Link href={`/car/${car._id}`}>View spot</Link>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-[#D9D9D9] text-xl">
            No spots to display on the map.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllSpotsMap;

// components/PostMiniMap.tsx

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* // Fixing Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl; */

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface PostMiniMapProps {
  city: string;
  country: string;
}

const PostMiniMap = ({ city, country }: PostMiniMapProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
            city
          )}&country=${encodeURIComponent(country)}&format=json`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError("Location not found.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Failed to fetch location data.");
      }
    };
    fetchCoordinates();
  }, [city, country]);

  return (
    <div className="p-4 shadow-lg">
      <h2 className="text-base font-light text-[#D9D9D9] mb-2">Location Map</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : position ? (
        <MapContainer
          center={position}
          zoom={11}
          style={{ height: "360px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {city}, {country}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-[#D9D9D9]">Loading map...</p>
      )}
    </div>
  );
};

export default PostMiniMap;

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useState, useEffect } from "react";
import { useMapData } from "../context/MapDataContext";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AllSpotsMap = () => {
  const { carsWithCoords, loading } = useMapData();
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // Default center

  useEffect(() => {
    if (carsWithCoords.length > 0) {
      setMapCenter([carsWithCoords[0].latitude!, carsWithCoords[0].longitude!]);
    }
  }, [carsWithCoords]);

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

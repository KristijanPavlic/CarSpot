"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Car, Id } from "@/app/types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingCars = () => {
  const pendingCars = useQuery(api.cars.getPendingCars);
  const approveCar = useMutation(api.cars.approveCar);
  const declineCar = useMutation(api.cars.declineCar);

  const handleApprove = async (carId: string) => {
    try {
      await approveCar({ carId: carId as Id<"cars"> });
      toast.success("Spot approved successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to approve spot.", { autoClose: 5000 });
    }
  };

  const handleDecline = async (carId: string, imagePublicIds: string[]) => {
    console.log("Declining car with ID:", carId);

    try {
      await declineCar({ carId: carId as Id<"cars">, imagePublicIds });
      toast.success("Spot declined and deleted successfully!", {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to decline spot.", { autoClose: 5000 });
    }
  };

  if (!pendingCars) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <ToastContainer
        position="top-center"
        pauseOnHover
        theme="dark"
        newestOnTop
      />
      <div className="container m-auto pl-[4.5rem] pr-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D9D9D9]">
          Pending Spots
        </h2>
        {pendingCars.length === 0 ? (
          <p className="text-[#D9D9D9]">No pending spots.</p>
        ) : (
          <ul className="space-y-6 mt-6">
            {pendingCars.map((car: Car) => (
              <li
                key={car._id}
                className="bg-[#212121] p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-[#BBD01A]">
                  {car.brand} {car.model} ({car.year})
                </h3>
                <p className="text-[#D9D9D9]">
                  Location: {car.city}, {car.country}
                </p>
                <p className="text-[#D9D9D9]">Submitted by: {car.username}</p>
                {/* Display images */}
                <div className="flex gap-6 flex-wrap mt-4">
                  {car.imagePublicIds &&
                    car.imagePublicIds.map((publicId) => (
                      <Image
                        key={publicId}
                        src={`https://res.cloudinary.com/dn0ngtrru/image/upload/v1726423541/${car.postId}/${publicId}`}
                        alt={publicId}
                        width={400}
                        height={350}
                        className="object-cover rounded-md"
                      />
                    ))}
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleApprove(car._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      car.imagePublicIds &&
                      handleDecline(car._id, car.imagePublicIds)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default PendingCars;

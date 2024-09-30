"use client";

import getLoggedInUserId from "../functions/getLoggedInUser";
import CarCard from "../components/CarCard";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function UserCars() {
  const path = usePathname();
  const userIdFromPath = path.slice(1);

  const userCars = useQuery(api.cars.getCarsByUserId, {
    userId: userIdFromPath,
  });

  const cars = useMemo(() => userCars ?? [], [userCars]);
  const deleteCar = useMutation(api.cars.deleteCar);

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold">
        Posts by {cars.map((car) => car.username)[0]}
      </h2>
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cars.map((car) => (
            <CarCard
              key={car._id}
              car={car}
              isAdmin={false}
              userId={userIdFromPath}
              deleteCar={deleteCar}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-xl">No posts found for this user.</p>
      )}
    </section>
  );
}

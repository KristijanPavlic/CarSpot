"use client";

import CarCard from "../components/CarCard";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

interface UserCarsProps {
  loggedInUserId?: string | undefined;
  adminId: string | undefined;
}

export default function UserCars({ loggedInUserId, adminId }: UserCarsProps) {
  const path = usePathname();
  const userIdFromPath = path.slice(1);

  const userCars = useQuery(api.cars.getCarsByUserId, {
    userId: userIdFromPath,
  });

  const cars = useMemo(() => userCars ?? [], [userCars]);
  const deleteCar = useMutation(api.cars.deleteCar);

  return (
    <section className="pl-[4.5rem] pr-4 p-10">
      <h2 className="text-3xl md:text-4xl font-bold text-[#D9D9D9]">
        {
          // If the user is viewing their own profile, show "My Spots". Otherwise, show "Spots by [username]"
          cars.map((car) => car.username)[0]
            ? `Spots by ${cars.map((car) => car.username)[0]}`
            : "My Spots"
        }
      </h2>
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cars.map((car) => (
            <CarCard
              key={car._id}
              car={car}
              isAdmin={adminId === loggedInUserId}
              userId={loggedInUserId}
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

"use client";

import Header from "../components/CustomHeader";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useRef, useEffect, useState } from "react";
import CarCard from "./CarCard";
import { usePathname } from "next/navigation";
import UserProfileCard from "./UserProfileCard";
import PostMiniMap from "./PostMiniMap";

interface PostPageProps {
  user: any;
  userId: string;
  isAdmin: boolean;
  carId: string;
}

export default function PostPageClient({
  user,
  userId,
  isAdmin,
  carId,
}: PostPageProps) {
  const path = usePathname();
  const postIdPath = path.split("/")[2];

  const userCars = useQuery(api.cars.getCarById, {
    postId: postIdPath,
  });

  const cars = useMemo(() => userCars ?? [], [userCars]);
  const deleteCar = useMutation(api.cars.deleteCar);

  // Assuming the first car is the one we want to display
  const car = cars[0];

  // State to hold the height of the car card
  const [carCardHeight, setCarCardHeight] = useState<number | null>(null);
  const carCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carCardRef.current) {
      setCarCardHeight(carCardRef.current.clientHeight);
    }
  }, [cars]);

  return (
    <main>
      <Header user={user} userId={user?.id} isAdmin={isAdmin} />
      <div className="container m-auto pl-[4.5rem] pr-4 py-10">
        <div className="flex lg:flex-row flex-col gap-6">
          <div className="lg:w-[70%] w-full" ref={carCardRef}>
            {cars.map((car, index) => (
              <CarCard
                key={index}
                car={car}
                isAdmin={isAdmin}
                userId={userId}
                deleteCar={deleteCar}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 lg:w-[30%] w-full">
            <div className="bg-[#212121] rounded-lg">
              {car && <PostMiniMap city={car.city} country={car.country} />}
            </div>
            <div className="bg-[#212121] rounded-lg">
              <UserProfileCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

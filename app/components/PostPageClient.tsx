"use client";

import Header from "../components/CustomHeader";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
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

  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <div className="px-5 py-10">
        <div className="flex flex-row gap-6 xl:w-[80%] w-full m-auto">
          <div className="w-[60%]">
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
          <div className="flex flex-col gap-6 w-[40%]">
            <div className="bg-[#212121] rounded-lg">
              <PostMiniMap />
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

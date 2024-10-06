import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

const UserProfileCard = () => {
  const path = usePathname();
  const postIdPath = path.split("/")[2];

  const userCars = useQuery(api.cars.getCarById, {
    postId: postIdPath,
  });
  const cars = useMemo(() => userCars ?? [], [userCars]);

  return (
    <div>
      {cars.map((car, index) => (
        <span key={index}>{car.username}</span>
      ))}
    </div>
  );
};

export default UserProfileCard;

import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import Link from "next/link";

const UserProfileCard = () => {
  const path = usePathname();
  const postIdPath = path.split("/")[2];

  const userCars = useQuery(api.cars.getCarById, {
    postId: postIdPath,
  });
  const cars = useMemo(() => userCars ?? [], [userCars]);
  const carUserId = cars.map((car) => car.userId).filter(Boolean)[0];

  return (
    <div>
      {cars.map((car, index) => (
        <div key={index}>
          <div className="flex flex-row items-center justify-between shadow-lg">
            <div className="p-4">
              <h2 className="text-base font-light text-[#D9D9D9]">Spotter</h2>
              <div>
                <div className="text-white mt-4">
                  <h3 className="text-lg mb-2">{car.username}</h3>
                  <Link href={`/${carUserId}`} className="text-[#BBD01A]">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfileCard;

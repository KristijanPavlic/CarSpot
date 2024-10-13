import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const UserProfileCard = () => {
  const path = usePathname();
  const postIdPath = path.split("/")[2];

  const userCars = useQuery(api.cars.getCarById, {
    postId: postIdPath,
  });
  const cars = useMemo(() => userCars ?? [], [userCars]);
  const carUserId = cars.map((car) => car.userId).filter(Boolean)[0];

  const getUser = useQuery(api.cars.getUserByUsername, { username: carUserId });

  return (
    <div>
      {cars.map((car, index) => (
        <div key={index}>
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-lg font-light text-[#D9D9D9]">Spotter</h2>
              <div>
                {/* <Image
                  src={user?.picture || "/default-profile.png"}
                  width={24}
                  height={24}
                  alt="profile picture"
                  className="rounded-full"
                /> */}
                <div>
                  <h3>{car.username}</h3>
                  <Link href={`/${carUserId}`}>View Profile</Link>
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

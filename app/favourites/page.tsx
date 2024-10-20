import { getUserSession } from "../utils/getUserSession";
/* import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import CarCard from "../components/CarCard"; */

import Header from "../components/CustomHeader";

export default async function Favourites() {
  const { user, isAdmin } = await getUserSession();

  /* const favoriteCars =
    useQuery(api.favorites.getFavoriteCarsByUserId, { userId: user.id }) || [];
  const deleteCar = useMutation(api.cars.deleteCar);

  if (!favoriteCars) return <div>Loading...</div>; */

  return (
    <main>
      <Header user={user} userId={user?.id} isAdmin={isAdmin} />
      <div className="container m-auto pl-[4.5rem] pr-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#D9D9D9]">
          Your Favourites
        </h2>
        {/* {favoriteCars.map((car) => (
          <CarCard
            key={car._id}
            car={car}
            userId={user.id}
            isAdmin={false}
            deleteCar={deleteCar}
          />
        ))} */}
      </div>
    </main>
  );
}

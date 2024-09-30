/* "use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CarDetail from "../../components/CarDetail";

interface PageProps {
  params: {
    username: string;
    postSlug: string;
  };
}

const CarPage = ({ params }: PageProps) => {
  const { username, postSlug } = params;

  const car = useQuery(api.cars.getCarBySlug, { username, postSlug });

  if (car === undefined) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found.</div>;
  }

  return <CarDetail car={car} />;
};

export default CarPage;
 */
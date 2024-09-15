// CarCard.tsx
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { FunctionReference } from "convex/server";
import { ReactMutation } from "convex/react";
import Image from "next/image";
import Slider from "react-slick";
import ElementTile from "./ElementTile";
import { Car } from "../types/types";
import { NextArrow, PrevArrow } from "./CustomArrow";

interface CarCardProps {
  car: Car;
  isAdmin: boolean;
  userId: string;
  deleteCar: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      { id: Id<"cars"> },
      null,
      string | undefined
    >
  >;
}

const CarCard = ({ car, isAdmin, userId, deleteCar }: CarCardProps) => {
  // Slider settings
  const settings = {
    key: car._id,
    dots: false,
    infinite: (car.imagePublicIds ?? []).length > 1,
    arrows: (car.imagePublicIds ?? []).length > 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "rounded-xl",
  };

  return (
    <div className="h-fit max-w-[645px] bg-[#212121] shadow-lg rounded-xl hover:shadow-xl transition-shadow">
      <div className="relative">
        {car.imagePublicIds && car.imagePublicIds.length > 0 ? (
          <Slider {...settings}>
            {car.imagePublicIds.map((imageName, idx) => (
              <div
                key={`${car._id}-${idx}`}
                className="relative w-full h-48 md:h-64 lg:h-80 xl:h-96"
              >
                <Image
                  src={`https://res.cloudinary.com/dn0ngtrru/image/upload/v1726423541/${car.postId}/${imageName}.jpg`}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="rounded-xl object-cover bg-center"
                />
                <div className="text-white">{imageName}</div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="relative w-full h-64">
            <Image
              src={`https://via.placeholder.com/300x200.png?text=${car.brand}+${car.model}`}
              alt={`${car.brand} ${car.model}`}
              fill
              className="rounded-xl object-cover"
            />
          </div>
        )}

        <ElementTile
          icon="imagesmode"
          content={String(car.imagePublicIds?.length || 0)}
          tooltip="Number of images"
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl text-white font-bold">
          {car.brand} {car.model}
        </h2>
        <p className="text-lg text-[#D9D9D9] pt-1">{car.year}</p>
        <div className="text-lg text-[#D9D9D9] pt-4">
          <div className="flex gap-1">
            <span className="material-symbols-outlined">pin_drop</span>
            {car.city}, {car.country}
          </div>
        </div>
      </div>
      {(isAdmin || userId === car.userId) && (
        <div className="flex gap-4 float-right pr-4 pb-4">
          <button
            className="block w-fit p-4 bg-[#D9D9D9] text-[#212121] rounded-xl py-2 hover:bg-[#ffffff] transition duration-300 ease-in-out"
            // onClick={() => editCar({ id: car._id })}
          >
            <div className="flex justify-center gap-2">
              Edit
              <span className="material-symbols-outlined">edit</span>
            </div>
          </button>
          <button
            className="block w-fit p-4 bg-[#B71C1C] text-white rounded-xl py-2 hover:bg-red-400 transition duration-300 ease-in-out"
            onClick={() => {
              const isConfirmed = window.confirm(
                "Are you sure you want to delete this post?"
              );
              if (isConfirmed) {
                deleteCar({ id: car._id });
              }
            }}
          >
            <div className="flex justify-center gap-2">
              Delete
              <span className="material-symbols-outlined">delete</span>
            </div>
          </button>
        </div>
      )}
      {/* Implement pagination */}
    </div>
  );
};

export default CarCard;

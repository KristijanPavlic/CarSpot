// CarCard.tsx
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { FunctionReference } from "convex/server";
import { ReactMutation } from "convex/react";
import Image from "next/image";
import Slider from "react-slick";
import ElementTile from "./ElementTile";
import { Car } from "../types/types";
import { NextArrow, PrevArrow } from "./CustomArrow";
import StarIcon from "@/public/star.svg";
import Link from "next/link";

interface CarCardProps {
  car: Car;
  isAdmin: boolean;
  userId: string;
  username: string;
  deleteCar: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        id: Id<"cars">;
        imagePublicIds?: string[];
        folder?: string;
      },
      string
    >
  >;
}

const CarCard = ({
  car,
  isAdmin,
  userId,
  username,
  deleteCar,
}: CarCardProps) => {
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

  const uploadUrl = `https://res.cloudinary.com/dn0ngtrru/image/upload/v1726423541`;
  const [isFilled, setIsFilled] = useState(false);

  return (
    <div className="h-fit max-w-[645px] bg-[#212121] shadow-lg rounded-xl hover:shadow-xl transition-shadow">
      <div className="relative">
        {car.imagePublicIds && car.imagePublicIds.length > 0 ? (
          <Slider {...settings}>
            {car.imagePublicIds.map((imageName, idx) => (
              <div
                key={`${car._id}-${idx}`}
                className="relative w-full h-48 md:h-64 lg:h-80 xl:h-96 focus:outline-none"
              >
                <Image
                  src={`${uploadUrl}/${car.postId}/${imageName}`}
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
      <div className="p-4 relative">
        <div className="absolute right-4">
          <span
            className="transition-all duration-300 ease-in-out hover:cursor-pointer"
            onMouseEnter={() => setIsFilled(true)}
            onMouseLeave={() => setIsFilled(false)}
            title={isFilled ? "Add to favourites" : "Remove from favourites"}
          >
            {isFilled ? (
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.72195 0.575998L5.61038 4.85734L0.886033 5.5461C0.0388191 5.66898 -0.300713 6.71345 0.313678 7.31167L3.73163 10.6423L2.92323 15.3473C2.77771 16.1977 3.67343 16.8347 4.42363 16.437L8.65 14.2155L12.8764 16.437C13.6266 16.8315 14.5223 16.1977 14.3768 15.3473L13.5684 10.6423L16.9863 7.31167C17.6007 6.71345 17.2612 5.66898 16.414 5.5461L11.6896 4.85734L9.57806 0.575998C9.19972 -0.187141 8.10351 -0.196842 7.72195 0.575998Z"
                  fill="#DDD165"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.4168 5.54705L11.6916 4.85817L9.57969 0.576096C9.20129 -0.187173 8.1049 -0.196876 7.72327 0.576096L5.61134 4.85817L0.886184 5.54705C0.0388257 5.66995 -0.300765 6.71459 0.313732 7.31292L3.73227 10.6441L2.92373 15.3499C2.77819 16.2005 3.67406 16.8376 4.42439 16.4398L8.65148 14.2179L12.8786 16.4398C13.6289 16.8344 14.5248 16.2005 14.3792 15.3499L13.5707 10.6441L16.9892 7.31292C17.6037 6.71459 17.2641 5.66995 16.4168 5.54705ZM11.9051 10.1008L12.6716 14.5769L8.65148 12.465L4.63138 14.5769L5.39788 10.1008L2.14428 6.93128L6.63981 6.27798L8.65148 2.20289L10.6631 6.27798L15.1587 6.93128L11.9051 10.1008Z"
                  fill="#DDD165"
                />
              </svg>
            )}
          </span>
        </div>
        <h2 className="text-2xl text-white font-bold">
          {car.brand} {car.model}
        </h2>
        <p className="text-lg text-[#D9D9D9] pt-1">{car.year}</p>
        <div className="text-lg text-[#D9D9D9] pt-4">
          <div className="flex gap-2">
            <span className="material-symbols-outlined">location_on</span>
            {car.city}, {car.country}
          </div>
        </div>
        <div className="text-base text-[#D9D9D9] pt-6">
          <div className="flex gap-2">
            <span className="material-symbols-outlined">visibility</span>
            <div>
              Spotted by:{" "}
              <Link
                href="#"
                className="hover:underline transition duration-300 ease-in-out"
              >
                {car.username}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 float-right pr-4 pb-4">
        <Link
          href={`/car/${car._id}`}
          passHref
          className="block w-fit p-4 bg-[#D9D9D9] text-[#212121] rounded-xl py-2 hover:bg-[#ffffff] transition duration-300 ease-in-out"
        >
          <span className="font-bold">View spot</span>
        </Link>
      </div>
      {(isAdmin || userId === car.userId) && (
        <div className="flex flex-wrap gap-4 float-right px-4 pb-4">
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
                deleteCar({
                  id: car._id,
                });
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

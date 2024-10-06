"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { SearchContext } from "../context/SearchContext";
import { usePathname } from "next/navigation";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import Image from "next/image";
import Link from "next/link";

import addSpot from "../../public/addspot.svg";

interface CustomHeaderProps {
  user: any;
  userId?: string;
  isAdmin?: boolean;
}

const CustomHeader = ({ user, userId, isAdmin }: CustomHeaderProps) => {
  const { isSearchVisible, toggleSearchVisibility } = useContext(SearchContext);
  const path = usePathname();

  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [shouldShowText, setShouldShowText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isExpanded = isMobile
    ? isManuallyExpanded
    : isManuallyExpanded || isHovered;

  useEffect(() => {
    const checkIfMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
      }
    };
    checkIfMobile();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isExpanded) {
      timeoutId = setTimeout(() => {
        setShouldShowText(true);
      }, 100); // Delay matches the transition duration
    } else {
      setShouldShowText(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsManuallyExpanded(false);
      }
    };

    if (isMobile && isManuallyExpanded) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobile, isManuallyExpanded]);

  return (
    <header className="bg-[#bbd01a] text-[#212121] hover:text-black fixed left-0 top-0 h-[100svh] z-[99999]  transition duration-300 ease-in-out">
      <div
        ref={menuRef}
        className={`flex flex-col gap-4 px-2 overflow-y-auto overflow-x-hidden ${
          isExpanded ? "items-start w-48" : "items-center w-14"
        } py-3 rounded-r-lg shadow-lg h-full transition-all duration-300 ease-in-out`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsManuallyExpanded(!isExpanded)}
          className="text-[#212121] hover:text-black p-2 w-full flex items-center justify-center focus:outline-none"
        >
          <span className="material-symbols-outlined">
            {isExpanded ? "chevron_left" : "chevron_right"}
          </span>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold p-2 mb-4 flex items-center"
        >
          {shouldShowText ? <span>CarSpot</span> : <span>CS</span>}
        </Link>

        {/* Navigation Items */}
        <div className="flex flex-col items-start gap-4 w-full">
          <Link
            href="/"
            className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center gap-2 ${
              isExpanded ? "" : "justify-center"
            } transition duration-300 ease-in-out`}
          >
            <span className="material-symbols-outlined">home</span>
            {shouldShowText && <span className="whitespace-nowrap">Home</span>}
          </Link>

          {!path.includes("car") && (
            <button
              onClick={toggleSearchVisibility}
              className={`flex items-center gap-2 text-base font-semibold rounded-lg p-2 w-full hover:bg-[#212121] hover:text-white transition duration-300 ease-in-out ${
                isExpanded ? "" : "justify-center"
              }`}
            >
              <span className="material-symbols-outlined">search</span>
              {shouldShowText && (
                <span className="whitespace-nowrap">Search</span>
              )}
            </button>
          )}
          <Link
            href="/upload"
            className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center gap-2 ${
              isExpanded ? "" : "justify-center"
            } transition duration-300 ease-in-out`}
          >
            <span>
              <svg
                fill="currentColor"
                height="22"
                width="22"
                version="1.1"
                id="Icons"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path d="M24,16c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S28.4,16,24,16z M27,25h-2v2c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2h-2 c-0.6,0-1-0.4-1-1s0.4-1,1-1h2v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2h2c0.6,0,1,0.4,1,1S27.6,25,27,25z"></path>{" "}
                  <path d="M8.4,22l1.2-2.3c0.5-1,1.5-1.7,2.7-1.7h3.5c0.1,0,0.2,0,0.2,0c1.8-2.4,4.7-4,8-4c1.2,0,2.3,0.2,3.4,0.6 C27,14,26.5,13.4,26,13h1c0.6,0,1-0.4,1-1s-0.4-1-1-1h-2.8L23,8c-0.8-1.8-2.6-3-4.6-3H9.6C7.6,5,5.8,6.2,5,8l-1.3,3H1 c-0.6,0-1,0.4-1,1s0.4,1,1,1h1c-1.2,0.9-2,2.4-2,4v4c0,0.9,0.4,1.7,1,2.2V25c0,1.7,1.3,3,3,3h2c1.7,0,3-1.3,3-3v-1h5 c0-0.7,0.1-1.4,0.2-2H8.4z M7,19H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h3c0.6,0,1,0.4,1,1S7.6,19,7,19z M5.5,12l1.4-3.2C7.4,7.7,8.4,7,9.6,7 h8.7c1.2,0,2.3,0.7,2.8,1.8l1.4,3.2H5.5z"></path>{" "}
                </g>
              </svg>
            </span>
            {shouldShowText && (
              <span className="whitespace-nowrap">Post a spot</span>
            )}
          </Link>
          <Link
            href="/"
            className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center gap-2 ${
              isExpanded ? "" : "justify-center"
            } transition duration-300 ease-in-out`}
          >
            <span className="material-symbols-outlined">map</span>
            {shouldShowText && <span className="whitespace-nowrap">Map</span>}
          </Link>
          <Link
            href="/contact"
            className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center gap-2 ${
              isExpanded ? "" : "justify-center"
            } transition duration-300 ease-in-out`}
          >
            <span className="material-symbols-outlined">contact_support</span>
            {shouldShowText && (
              <span className="whitespace-nowrap">Contact</span>
            )}
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-start gap-4 z-[999] mt-auto w-full">
          {user ? (
            <div className="relative w-full">
              <div className="flex flex-col gap-4 mb-4">
                <Link
                  href={`/${userId}`}
                  // href="/profile"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                >
                  <Image
                    src={user?.picture || "/default-profile.png"}
                    width={24}
                    height={24}
                    alt="profile picture"
                    className="rounded-full"
                  />
                  {shouldShowText && (
                    <span className="whitespace-nowrap">Profile</span>
                  )}
                </Link>
                <Link
                  href="/favourites"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                >
                  <span className="material-symbols-outlined">star</span>
                  {shouldShowText && (
                    <span className="whitespace-nowrap">Favourites</span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                  >
                    <span className="material-symbols-outlined">grid_view</span>
                    {shouldShowText && (
                      <span className="whitespace-nowrap">Dashboard</span>
                    )}
                  </Link>
                )}
                <div className="w-full h-[1px] bg-black"></div>
                <LogoutLink className="flex items-center p-2 rounded-lg font-medium hover:bg-red-700 hover:text-white w-full transition duration-300 ease-in-out">
                  <span className="material-symbols-outlined">logout</span>
                  {shouldShowText && (
                    <span className="ml-2 whitespace-nowrap">Log out</span>
                  )}
                </LogoutLink>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <LoginLink className="flex items-center gap-2 p-2 rounded-lg font-semibold hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out">
                <span className="material-symbols-outlined">login</span>
                {shouldShowText && (
                  <span className="whitespace-nowrap">Log in</span>
                )}
              </LoginLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;

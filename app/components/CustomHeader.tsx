"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { SearchContext } from "../context/SearchContext";
import { usePathname } from "next/navigation";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import Image from "next/image";
import Link from "next/link";

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
    <header className="text-[#212121] hover:text-black fixed left-0 top-0 h-[100svh] z-[99999] transition duration-300 ease-in-out">
      <div
        ref={menuRef}
        className={`flex flex-col gap-4 px-2 bg-[#bbd01a] ${
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
          {path.length !== 1 && (
            <Link
              href="/"
              className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center gap-2 ${
                isExpanded ? "" : "justify-center"
              } transition duration-300 ease-in-out`}
            >
              <span className="material-symbols-outlined">home</span>
              {shouldShowText && (
                <span className="whitespace-nowrap">Home</span>
              )}
            </Link>
          )}
          {!path.includes("car") && (
            <button
              onClick={toggleSearchVisibility}
              className={`flex items-center gap-2 text-base font-semibold rounded-lg p-2 w-full transition duration-300 ease-in-out ${
                isExpanded ? "" : "justify-center"
              } ${
                isSearchVisible
                  ? "bg-[#212121] text-white"
                  : "hover:bg-[#212121] hover:text-white"
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
            <span className="material-symbols-outlined">add_circle</span>
            {shouldShowText && (
              <span className="whitespace-nowrap">Post a spot</span>
            )}
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-start gap-4 z-[999] mt-auto w-full">
          {user ? (
            <div className="relative w-full">
              <div className="flex flex-col gap-2 mb-4">
                <Link
                  href={`/${userId}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
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
                <LogoutLink className="flex items-center p-2 mb-2 rounded-lg font-medium hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out">
                  <span className="material-symbols-outlined">logout</span>
                  {shouldShowText && (
                    <span className="ml-2 whitespace-nowrap">Log out</span>
                  )}
                </LogoutLink>
              </div>
              <div
                className={`flex items-center gap-2 w-full ${
                  isExpanded ? "" : "justify-center"
                }`}
              >
                <div className="flex items-center gap-2 w-full profile-icon-container whitespace-nowrap">
                  <Image
                    src={user?.picture || "/default-profile.png"}
                    width={40}
                    height={40}
                    alt="profile picture"
                    className="rounded-full"
                  />
                  {/* {shouldShowText && (
                    <span className="text-sm p-2">
                      Welcome {user.given_name}
                    </span>
                  )} */}
                </div>
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

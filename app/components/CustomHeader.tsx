// CustomHeader.js
"use client";

import React, { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { usePathname } from "next/navigation";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

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
  const isExpanded = isManuallyExpanded || isHovered;

  return (
    <header
      className="text-[#212121] hover:text-black fixed left-0 top-0 h-[100svh] z-[99999] transition duration-300 ease-in-out"
      onClick={() => setIsManuallyExpanded(false)}
    >
      <div
        className={`flex flex-col items-start gap-4 bg-[#bbd01a] ${
          isExpanded ? "w-64 px-6" : "w-16 px-4"
        } py-3 rounded-r-lg shadow-lg h-full transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        <Link href="/" className="text-2xl font-bold mb-4 flex items-center">
          {isExpanded ? <span className="ml-2">CarSpot</span> : <span>CS</span>}
        </Link>

        {/* Navigation Items */}
        <div className="flex flex-col items-start gap-4 w-full">
          {path.length !== 1 && (
            <Link
              href="/"
              className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center ${
                isExpanded ? "" : "justify-center"
              } transition duration-300 ease-in-out`}
            >
              <span className="material-symbols-outlined">home</span>
              {isExpanded && <span className="ml-2">Home</span>}
            </Link>
          )}
          {!path.includes("car") && (
            <button
              onClick={toggleSearchVisibility}
              className={`flex items-center text-base font-semibold rounded-lg p-2 w-full transition duration-300 ease-in-out ${
                isExpanded ? "" : "justify-center"
              } ${
                isSearchVisible
                  ? "bg-[#212121] text-white"
                  : "hover:bg-[#212121] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">search</span>
              {isExpanded && <span className="ml-2">Search</span>}
            </button>
          )}

          <Link
            href="/upload"
            className={`text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 w-full flex items-center ${
              isExpanded ? "" : "justify-center"
            } transition duration-300 ease-in-out`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            {isExpanded && <span className="ml-2">Post a spot</span>}
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-start gap-4 z-[999] mt-auto w-full">
          {user ? (
            <div className="relative w-full">
              {isExpanded && (
                <div className="flex flex-col gap-2 mb-4">
                  {isAdmin && (
                    <Link
                      href="/"
                      className="p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href={`/${userId}`}
                    className="p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/favourites"
                    className="p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out"
                  >
                    Favourites
                  </Link>
                  <div className="w-full h-[1px] bg-black"></div>
                  <LogoutLink className="text-base font-medium w-full">
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-[#212121] hover:text-white w-full transition duration-300 ease-in-out">
                      Log out
                      <span className="material-symbols-outlined">logout</span>
                    </div>
                  </LogoutLink>
                </div>
              )}
              <div
                className={`flex items-center gap-2 w-full ${
                  isExpanded ? "" : "justify-center"
                }`}
              >
                <div className="profile-icon-container">
                  <Image
                    src={user?.picture || "/default-profile.png"}
                    width={40}
                    height={40}
                    alt="profile picture"
                    className="rounded-full"
                  />
                </div>
                {isExpanded && (
                  <span className="text-sm p-2">Welcome {user.given_name}</span>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;

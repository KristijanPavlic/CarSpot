"use client";

import React, { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import Image from "next/image";
import Link from "next/link";
import FilterForm from "./FilterForm";

interface CustomHeaderProps {
  user: any;
  userId?: string;
  isAdmin?: boolean;
}

const CustomHeader = ({ user, userId, isAdmin }: CustomHeaderProps) => {
  const { isSearchVisible, toggleSearchVisibility } = useContext(SearchContext);

  return (
    <header className=" text-[#212121] hover:text-black mt-4 flex justify-between items-center container m-auto px-5 w-full sticky lg:top-2 top-6 z-[99999] transition duration-300 ease-in-out">
      <div className="flex items-center justify-between gap-4 container m-auto bg-[#bbd01a] p-4 rounded-lg shadow-lg">
        <Link href="/" className="text-2xl font-bold">
          CarSpot
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSearchVisibility}
            className={`flex items-center gap-1 text-base font-semibold rounded-lg p-2 transition duration-300 ease-in-out ${
              isSearchVisible
                ? "bg-[#212121] text-white"
                : "hover:bg-[#212121] hover:text-white"
            }`}
          >
            Search
            <span className="material-symbols-outlined">search</span>
          </button>
          {user && (
            <Link
              href="/upload"
              className="text-base font-semibold hover:bg-[#212121] rounded-lg hover:text-white p-2 transition duration-300 ease-in-out"
            >
              Post a spot
            </Link>
          )}
          <div className="flex items-center gap-4 z-[999]">
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="profile-icon-container">
                    <Image
                      src={user?.picture || "/default-profile.png"} // Default image if no profile picture
                      width={40}
                      height={40}
                      alt="profile picture"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="dropdown-menu flex flex-col gap-2 w-max px-4 py-2 absolute right-[-1rem] mt-1 bg-[#bbd01a] text-black p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm p-2">Welcome {user.given_name}</p>
                  <div className="w-full h-[1px] bg-[#212121]"></div>
                  <Link
                    href={`/${userId}`}
                    className="p-2 rounded-lg hover:bg-[#212121] hover:text-white  transition duration-300 ease-in-out"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/"
                      className="p-2 rounded-lg hover:bg-[#212121] hover:text-white  transition duration-300 ease-in-out"
                    >
                      Dashboard
                    </Link>
                  )}
                  <LogoutLink className="text-base font-medium">
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-[#212121] hover:text-white  transition duration-300 ease-in-out">
                      Log out
                      <span className="material-symbols-outlined">logout</span>
                    </div>
                  </LogoutLink>
                </div>
              </div>
            ) : (
              <>
                <LoginLink className="text-base hover:bg-[#212121] rounded-lg hover:text-white p-2 transition duration-300 ease-in-out">
                  Login
                </LoginLink>
                <RegisterLink className="text-base hover:bg-[#212121] rounded-lg hover:text-white p-2 transition duration-300 ease-in-out">
                  Sign up
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;

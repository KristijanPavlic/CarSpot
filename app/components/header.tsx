import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  user: any;
  isAdmin?: boolean;
}

const Header = ({ user, isAdmin }: HeaderProps) => {
  return (
    <header className="bg-[#bbd01a] text-[#212121] p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold">
          CarSpot
        </Link>
        {user && (
          <Link href="/upload" className="text-sm hover:text-gray-300">
            Upload
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4 z-[2]">
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

            <div className="dropdown-menu w-max px-4 py-2 absolute right-0 mt-2 bg-[#D9D9D9] text-black p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-sm mb-2 p-2">Welcome {user.given_name}</p>
              <LogoutLink className="text-base font-medium mt-4">
                <div className="flex gap-3 p-2 rounded-lg hover:bg-[#acacac] transition duration-300 ease-in-out">
                  Log out
                  <span className="material-symbols-outlined">logout</span>
                </div>
              </LogoutLink>
            </div>
          </div>
        ) : (
          <>
            <LoginLink className="text-sm hover:text-gray-300">Login</LoginLink>
            <RegisterLink className="text-sm hover:text-gray-300">
              Sign up
            </RegisterLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

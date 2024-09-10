import CarSearch from "./components/car-search";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import Image from "next/image";
import "./globals.css";
import Link from "next/link";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.id === process.env.ADMIN_ID;

  return (
    <div>
      <div className="header">
        {user ? (
          <div className="user-profile-container">
            <div className="profile-icon-container">
              <Image
                src={user?.picture || "no profile picture"}
                width={40}
                height={40}
                alt="profile picture"
                className="profile-image"
              />
            </div>
            <div className="dropdown-menu">
              <p>Welcome {user.given_name}</p>
              <LogoutLink>Log out</LogoutLink>
            </div>
          </div>
        ) : (
          <LoginLink>Login</LoginLink>
        )}

        <RegisterLink>Sign up</RegisterLink>
      </div>
      <Link href="/upload">Upload</Link>
      <CarSearch isAdmin={isAdmin} userId={user?.id} />
    </div>
  );
}

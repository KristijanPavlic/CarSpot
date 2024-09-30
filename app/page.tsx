import CarSearch from "./components/CarDisplay";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import "./globals.css";
import Header from "./components/Header";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  const isAdmin = user?.id === process.env.ADMIN_ID;

  return (
    <main>
      <Header user={user} userId={user?.id} isAdmin={isAdmin} />
      <CarSearch isAdmin={isAdmin} userId={user?.id} />
    </main>
  );
}

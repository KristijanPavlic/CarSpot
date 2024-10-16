import CustomHeader from "./components/CustomHeader";
import CarSearch from "./components/CarDisplay";
import { getUserSession } from "./utils/getUserSession";

import "./globals.css";

export default async function Home() {
  const { user, isAdmin } = await getUserSession();

  return (
    <>
      <CustomHeader user={user} userId={user?.id} isAdmin={isAdmin} />
      <main>
        <CarSearch isAdmin={isAdmin} userId={user?.id} />
      </main>
    </>
  );
}

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserCars from "../components/UserCars";
import Header from "../components/Header";

export default async function UserPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.id === process.env.ADMIN_ID;

  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <UserCars />
    </main>
  );
}

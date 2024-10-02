import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Header from "../components/CustomHeader";
import UserCars from "../components/UserCars";

export default async function UserPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.id === process.env.ADMIN_ID;
  const adminId = process.env.ADMIN_ID;

  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <UserCars loggedInUserId={user?.id} adminId={adminId} />
    </main>
  );
}

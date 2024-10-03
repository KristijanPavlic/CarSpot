import { getUserSession } from "../utils/getUserSession";

import Header from "../components/CustomHeader";
import UserCars from "../components/UserCars";

export default async function UserPage() {
  const { user, isAdmin, adminId } = await getUserSession();

  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <UserCars loggedInUserId={user?.id} adminId={adminId} />
    </main>
  );
}

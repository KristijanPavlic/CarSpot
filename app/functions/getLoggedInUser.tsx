import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function getLoggedInUserId() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.id === process.env.ADMIN_ID;
}
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUserSession() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.id === process.env.ADMIN_ID;
  const adminId = process.env.ADMIN_ID;

  return { user, isAdmin, adminId };
}

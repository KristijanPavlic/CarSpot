import { getUserSession } from "../utils/getUserSession";

import Header from "../components/CustomHeader";

export default async function Contact() {
  const { user, isAdmin, adminId } = await getUserSession();
  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <div className="pl-[4.5rem] pr-4 py-10">Contact</div>
    </main>
  );
}

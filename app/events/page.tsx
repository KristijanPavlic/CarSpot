import { getUserSession } from "../utils/getUserSession";

import Header from "../components/CustomHeader";

export default async function Events() {
  const { user, isAdmin } = await getUserSession();
  return (
    <main>
      <Header user={user} userId={user?.id} isAdmin={isAdmin} />
      <div className="container m-auto pl-[4.5rem] pr-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#D9D9D9]">
          Events
        </h2>
      </div>
    </main>
  );
}

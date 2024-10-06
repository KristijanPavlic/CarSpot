import { getUserSession } from "../utils/getUserSession";

import Header from "../components/CustomHeader";
import CreateCar from "../components/CreateCar";

const UploadPost = async () => {
  const { user, isAdmin, adminId } = await getUserSession();

  return (
    <main>
      <Header user={user} isAdmin={isAdmin} />
      <CreateCar userId={user?.id ?? ""} username={user?.given_name ?? ""} />
    </main>
  );
};

export default UploadPost;

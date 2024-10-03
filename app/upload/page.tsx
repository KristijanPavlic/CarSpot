import { getUserSession } from "../utils/getUserSession";

import CreateCar from "../components/CreateCar";

const UploadPost = async () => {
  const { user } = await getUserSession();

  return (
    <CreateCar userId={user?.id ?? ""} username={user?.given_name ?? ""} />
  );
};

export default UploadPost;

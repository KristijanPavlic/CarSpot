import CreateCar from "../components/CreateCar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const UploadPost = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <CreateCar userId={user?.id ?? ""} username={user?.given_name ?? ""} />
  );
};

export default UploadPost;

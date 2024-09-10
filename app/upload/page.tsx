import CreateCar from "../components/create-car";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const UploadPost = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return <CreateCar userId={user?.id} />;
};

export default UploadPost;

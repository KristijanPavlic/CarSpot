import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PostPageClient from "../../components/PostPageClient";

interface PostPageServerProps {
  params: {
    carId: string;
  };
}

export default async function PostPageServer({ params }: PostPageServerProps) {
  const { carId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.id === process.env.ADMIN_ID;

  return (
    <PostPageClient
      user={user}
      userId={user?.id}
      isAdmin={isAdmin}
      carId={carId}
    />
  );
}

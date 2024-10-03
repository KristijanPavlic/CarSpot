import { getUserSession } from "../../utils/getUserSession";
import PostPageClient from "../../components/PostPageClient";

interface PostPageServerProps {
  params: {
    carId: string;
  };
}

export default async function PostPageServer({ params }: PostPageServerProps) {
  const { carId } = params;
  const { user, isAdmin } = await getUserSession();

  return (
    <PostPageClient
      user={user}
      userId={user?.id}
      isAdmin={isAdmin}
      carId={carId}
    />
  );
}

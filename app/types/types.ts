import { Id } from "@/convex/_generated/dataModel";

export interface Car {
  _id: Id<"cars">;
  brand: string;
  model: string;
  year: string;
  city: string;
  country: string;
  imagePublicIds?: string[];
  userId: string;
  username: string;
  postId: string;
}

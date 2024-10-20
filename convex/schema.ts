import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cars: defineTable({
    brand: v.string(),
    model: v.string(),
    year: v.string(),
    city: v.string(),
    country: v.string(),
    userId: v.string(),
    username: v.string(),
    imagePublicIds: v.array(v.string()),
    postId: v.string(),
  }),
  favorites: defineTable({
    userId: v.string(),
    carId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_car", ["userId", "carId"]),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cars: defineTable({
    brand: v.string(),
    model: v.string(),
    year: v.string(),
    location: v.string(),
    userId: v.string(),
  }),
});

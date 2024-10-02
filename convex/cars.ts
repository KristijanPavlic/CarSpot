import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cars").collect();
  },
});

export const getCarsByUserId = query({
  args: { userId: v.string() }, // Expect a userId string argument
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cars") // Query the "cars" collection
      .filter((q) => q.eq(q.field("userId"), args.userId)) // Filter cars by userId
      .collect(); // Return all matching documents
  },
});

export const getCarById = query({
  args: { postId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cars")
      .filter((q) => q.eq(q.field("_id"), args.postId))
      .collect();
  },
});

export const createCar = mutation({
  args: {
    brand: v.string(),
    model: v.string(),
    year: v.string(),
    city: v.string(),
    country: v.string(),
    userId: v.string(),
    username: v.string(),
    imagePublicIds: v.array(v.string()),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const carId = await ctx.db.insert("cars", {
      brand: args.brand,
      model: args.model,
      year: args.year,
      city: args.city,
      country: args.country,
      userId: args.userId,
      username: args.username,
      imagePublicIds: args.imagePublicIds,
      postId: args.postId,
    });
  },
});

export const deleteCar = mutation({
  args: { id: v.id("cars") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return "Car deleted successfully";
  },
});

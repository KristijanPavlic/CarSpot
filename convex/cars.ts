import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import cloudinary from "../cloudinaryConfig";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cars").collect();
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
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    location: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const carId = await ctx.db.insert("cars", {
      brand: args.brand,
      model: args.model,
      year: args.year,
      location: args.location,
      userId: args.userId,
    });
  },
});

export const deleteCar = mutation({
  args: { id: v.id("cars") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

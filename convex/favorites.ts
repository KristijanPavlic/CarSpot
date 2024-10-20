import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addFavorite = mutation({
  args: { userId: v.string(), carId: v.string() },
  handler: async (ctx, args) => {
    // Prevent duplicates by checking if the favorite already exists
    const existingFavorite = await ctx.db
      .query("favorites")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("carId"), args.carId)
        )
      )
      .first();

    if (!existingFavorite) {
      await ctx.db.insert("favorites", {
        userId: args.userId,
        carId: args.carId,
      });
    }
  },
});

export const removeFavorite = mutation({
  args: { userId: v.string(), carId: v.string() },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("carId"), args.carId)
        )
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getFavoritesByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const getFavoriteCarsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const carIds = favorites.map((fav) => fav.carId);

    return await ctx.db
      .query("cars")
      .filter((q) => q.or(...carIds.map((id) => q.eq(q.field("_id"), id))))
      .collect();
  },
});

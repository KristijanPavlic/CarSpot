import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

import cloudinary from "cloudinary";
import axios from "axios";

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
      .filter((q) => q.eq(q.field("approved"), true)) // Only approved cars
      .collect(); // Return all matching documents
  },
});

export const getCarById = query({
  args: { postId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cars")
      .filter((q) => q.eq(q.field("_id"), args.postId))
      .filter((q) => q.eq(q.field("approved"), true))
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
    const { db } = ctx;

    await db.insert("cars", {
      brand: args.brand,
      model: args.model,
      year: args.year,
      city: args.city,
      country: args.country,
      userId: args.userId,
      username: args.username,
      imagePublicIds: args.imagePublicIds,
      postId: args.postId,
      approved: false,
      createdAt: Date.now(),
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

export const getPendingCars = query(async ({ db }) => {
  return await db
    .query("cars")
    .filter((q) => q.eq(q.field("approved"), false))
    .collect();
});

export const approveCar = mutation({
  args: {
    carId: v.id("cars"),
  },
  handler: async ({ db }, { carId }) => {
    await db.patch(carId, { approved: true });
  },
});

export const declineCar = mutation({
  args: { carId: v.id("cars"), imagePublicIds: v.array(v.string()) },
  handler: async ({ db }, { carId, imagePublicIds }) => {
    // Ensure Cloudinary credentials are loaded from environment variables
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    console.log("Cloudinary config:", cloudinaryConfig);

    if (
      !cloudinaryConfig.cloud_name ||
      !cloudinaryConfig.api_key ||
      !cloudinaryConfig.api_secret
    ) {
      throw new Error("Cloudinary credentials are missing.");
    }

    // Attempt to delete each image from Cloudinary
    try {
      for (const publicId of imagePublicIds) {
        await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/destroy`,
          { public_id: publicId },
          {
            auth: {
              username: cloudinaryConfig.api_key,
              password: cloudinaryConfig.api_secret,
            },
          }
        );
      }
    } catch (error) {
      console.error("Failed to delete images from Cloudinary:", error);
      throw new Error(
        "Image deletion failed. Check Cloudinary credentials and public IDs."
      );
    }

    // Attempt to delete the car document
    try {
      await db.delete(carId);
    } catch (error) {
      console.error("Failed to delete car document:", error);
      throw new Error(
        "Car deletion failed. Check car ID and database connection."
      );
    }
  },
});

export const getApprovedCars = query(async ({ db }) => {
  return await db
    .query("cars")
    .filter((q) => q.eq(q.field("approved"), true))
    .collect();
});

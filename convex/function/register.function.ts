import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserRegistration = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // Return null if no user is logged in
    if (!userId) {
      return null;
    }

    // Fetch the user profile
    const userRegisteredAs = await ctx.db
      .query("registeredAs")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    return userRegisteredAs || null;
  },
});

export const getUserRegistrationById = query({
  args: { registeredUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Return null if no user is logged in
    if (!userId) {
      return null;
    }

    // Fetch the user profile
    const userRegisteredAs = await ctx.db
      .query("registeredAs")
      .filter((q) => q.eq(q.field("userId"), args.registeredUserId))
      .first();

    return userRegisteredAs || null;
  },
});

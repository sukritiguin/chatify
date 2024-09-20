import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // Return null if no user is logged in
    if (!userId) {
      throw new Error("Unauthorized access");
    }

    // Fetch the user profile
    const profile = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("adminUserId"), userId))
      .first();

    return profile || null;
  },
});

export const getOrganizationById = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    const organization = await ctx.db.get(args.organizationId);

    return organization;
  },
});

export const insertOrganization = mutation({
  args: {
    data: v.object({
      name: v.string(), // Organization name (required)
      description: v.optional(v.string()), // Optional description of the organization
      website: v.optional(v.string()), // Optional website URL
      logo: v.optional(v.string()), // Optional logo of the organization
      banner: v.optional(v.string()), // Optional cover photo for the organization
      address: v.optional(v.string()), // Optional address of the organization
      industry: v.optional(v.string()), // Optional industry the organization belongs to
      established: v.optional(v.string()), // Optional year of establishment
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;
    const userId = await getAuthUserId(ctx);

    // Ensure the user is authenticated
    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    // Fetch the user profile
    const existingProfile = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("adminUserId"), userId))
      .first();

    console.log("Existing Profile: ", existingProfile);

    if (existingProfile) {
      throw new Error("A profile with this userId already exists.");
    }

    // Insert data into the profile table with userId and data
    const newOrganizationId = await ctx.db.insert("organizations", {
      adminUserId: userId,
      name: data.name,
      description: data.description,
      website: data.website,
      logo: data.logo,
      banner: data.banner,
      address: data.address,
      industry: data.industry,
      established: data.established,
    });

    return newOrganizationId; // Return the new profile ID
  },
});

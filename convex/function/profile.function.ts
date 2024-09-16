// convex/profileQueries.ts
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // Return null if no user is logged in
    if (!userId) {
      return null;
    }

    // Fetch the user profile
    const profile = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    return profile || null;
  },
});

// Define the mutation to insert profile data
// Define the mutation to insert profile data
export const insertProfile = mutation({
  args: {
    data: v.object({
      coverPhoto: v.optional(v.string()),
      profilePhoto: v.optional(v.string()),
      bio: v.optional(v.string()),
      educations: v.optional(
        v.array(
          v.object({
            institute: v.string(),
            course: v.string(),
            start: v.string(),
            end: v.string(),
            story: v.optional(v.string()),
          })
        )
      ),
      experiences: v.optional(
        v.array(
          v.object({
            company: v.string(),
            designation: v.string(),
            type: v.optional(
              v.union(
                v.literal("fulltime"),
                v.literal("internship"),
                v.literal("apprenticeship"),
                v.literal("parttime"),
                v.literal("WFH"),
                v.literal("freelance"),
                v.literal("")
              )
            ),
            start: v.string(),
            end: v.optional(v.string()),
          })
        )
      ),
      skills: v.optional(
        v.array(
          v.object({
            skill: v.string(),
            level: v.optional(
              v.union(
                v.literal("Beginner"),
                v.literal("Intermediate"),
                v.literal("Advanced"),
                v.literal("Proficient"),
                v.literal("Expert"),
                v.literal("Master"),
                v.literal("")
              )
            ),
          })
        )
      ),
      socials: v.optional(
        v.object({
          linkedIn: v.optional(v.string()),
          github: v.optional(v.string()),
          twitter: v.optional(v.string()),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;
    const userId = await getAuthUserId(ctx);

    // Ensure the user is authenticated
    if (!userId) {
      return null; // or throw an error
    }

    // Fetch the user profile
    const existingProfile = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    console.log("Existing Profile: ", existingProfile);

    if (existingProfile) {
      throw new Error("A profile with this userId already exists.");
    }

    // Insert data into the profile table with userId and data
    const newProfileId = await ctx.db.insert("profile", {
      userId: userId,
      coverPhoto: data.coverPhoto,
      profilePhoto: data.profilePhoto,
      bio: data.bio,
      educations: data.educations,
      experiences: data.experiences,
      skills: data.skills,
      socials: data.socials,
    });

    return newProfileId; // Return the new profile ID
  },
});

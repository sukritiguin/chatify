/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const postJob = mutation({
  args: {
    data: v.object({
      title: v.string(),
      description: v.string(),
      location: v.string(),
      employmentType: v.union(
        v.literal("full_time"),
        v.literal("part_time"),
        v.literal("contract"),
        v.literal("internship"),
        v.literal("temporary"),
        v.literal("freelance")
      ),
      salaryRange: v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      }),
      skills: v.array(v.string()), // List of required skills (can be skill names or IDs)
      experienceLevel: v.union(
        v.literal("entry"),
        v.literal("mid"),
        v.literal("senior"),
        v.literal("lead"),
        v.literal("director"),
        v.literal("executive")
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const data = {
      userId: userId,
      title: args.data.title,
      description: args.data.description,
      location: args.data.location,
      employmentType: args.data.employmentType,
      salaryRange: {
        min: args.data.salaryRange?.min,
        max: args.data.salaryRange?.max,
        currency: args.data.salaryRange?.currency,
      },
      skills: args.data.skills,
      experienceLevel: args.data.experienceLevel,
      postedBy: userId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      isActive: true,
    };

    const jobId = await ctx.db.insert("jobs", data);

    return jobId;
  },
});

export const getJobByJobId = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const job = await ctx.db.get(args.jobId);

    return job;
  },
});

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

export const getAllActiveJobs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const jobs = await ctx.db
      .query("jobs")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return jobs;
  },
});

export const getAllLocationsAndSkillsFromJobs = query({
  args: {},
  handler: async (ctx) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    let locations: string[] = [];
    let skills: string[] = [];

    const jobs = await ctx.db.query("jobs").collect();

    for (const job of jobs) {
      locations = [...locations, job.location];
      skills = [...skills, ...job.skills];
    }

    return {
      locations: locations || [],
      skills: skills || [],
    };
  },
});

export const mapUserIdWithOrganizationsForJobs = query({
  args: {},
  handler: async (ctx) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const organizations = await ctx.db.query("organizations").collect();

    const data = new Map();

    for (const organization of organizations) {
      data.set(organization.adminUserId, organization.name);
    }

    return Object.fromEntries(data.entries());
  },
});

export const applyJob = mutation({
  args: {
    jobId: v.id("jobs"),
    resumeUrl: v.string(),
    coverLetterUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const job = await ctx.db.get(args.jobId);
    if (!job?.isActive) {
      throw new Error("Job not active!");
    }

    await ctx.db.insert("applications", {
      applicantId: userId,
      jobId: args.jobId,
      resumeUrl: args.resumeUrl,
      coverLetter: args.coverLetterUrl || undefined,
      status: "applied" as
        | "accepted"
        | "rejected"
        | "applied"
        | "shortlisted"
        | "hired",
      appliedAt: new Date().toString(),
    });
  },
});

export const countApplicantByJobId = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const applications = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .collect()
      .then((applications) => applications.length);

    return applications;
  },
});

export const isCurrentUserAlreadyAppliedToThisJobId = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const application = await ctx.db
      .query("applications")
      .filter((q) =>
        q.and(
          q.eq(q.field("jobId"), args.jobId),
          q.eq(q.field("applicantId"), userId)
        )
      )
      .first();

    return application ? true : false;
  },
});

export const getAllJobListing = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized access!");

    const jobs = await ctx.db
      .query("jobs")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const result = [];

    for (const job of jobs) {
      const count = (
        await ctx.db
          .query("applications")
          .filter((q) => q.eq(q.field("jobId"), job._id))
          .collect()
      ).length;

      const data = {
        jobId: job._id,
        jobTitle: job.title,
        createdAt: job.createdAt,
        isActive: job.isActive,
        totalApplicants: count,
      };

      result.push(data);
    }

    return result;
  },
});

// Define a function to map status to their order
const getStatusOrder = (status: string) => {
  switch (status) {
    case "hired":
      return 4;
    case "applied":
      return -1;
    case "accepted":
      return 2;
    case "rejected":
      return 1;
    default:
      return 0; // Default for unknown statuses
  }
};

export const getAllApplications = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized access!");

    const applications = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .collect();

    // Sort applications based on status
    const sortedApplications = applications.sort((a, b) => {
      return getStatusOrder(a.status) - getStatusOrder(b.status);
    });

    return sortedApplications;
  },
});

export const shortListApplicant = mutation({
  args: { applicationId: v.id("applications"), isShortlisted: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized access!");

    await ctx.db.patch(args.applicationId, {
      status: args.isShortlisted ? "shortlisted" : "rejected",
    });
  },
});

export const closeJobByJobId = mutation({
  args: {jobId: v.id("jobs")},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if(!userId) {
      throw new Error("Unauthorized Access!");
    }

    const job = await ctx.db.get(args.jobId);

    if(job?.userId !== userId) {
      throw new Error("You are not allowed to update this job.");
    }

    if(!job.isActive){
      throw new Error("Job is already closed.");
    }

    await ctx.db.patch(args.jobId, {isActive: false});
  }
})

import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const profile = defineTable({
  userId: v.id("users"),
  name: v.string(),
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
});

// Define the organizations table
const organizations = defineTable({
  name: v.string(), // Organization name (required)
  description: v.optional(v.string()), // Optional description of the organization
  website: v.optional(v.string()), // Optional website URL
  logo: v.optional(v.string()), // Optional logo of the organization
  banner: v.optional(v.string()), // Optional cover photo for the organization
  address: v.optional(v.string()), // Optional address of the organization
  industry: v.optional(v.string()), // Optional industry the organization belongs to
  established: v.optional(v.string()), // Optional year of establishment

  // Reference to the users table for the admin or owner of the organization
  adminUserId: v.id("users"), // Admin or creator of the organization (foreign key to users table)
});

const schema = defineSchema({
  ...authTables,
  profile,
  organizations,
});

export default schema;

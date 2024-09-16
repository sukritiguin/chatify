import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const profile = defineTable({
  userId: v.id("users"),
  coverPhoto: v.optional(v.string()),
  profilePhoto: v.optional(v.string()),
  bio: v.optional(v.string()),
  educations: v.optional(v.array(
    v.object({
      institute: v.string(),
      course: v.string(),
      start: v.string(),
      end: v.string(),
      story: v.optional(v.string()),
    })
  )),
  experiences: v.optional(v.array(
    v.object({
      company: v.string(),
      designation: v.string(),
      type: v.union(
        v.literal("fulltime"),
        v.literal("internship"),
        v.literal("apprenticeship"),
        v.literal("part time"),
        v.literal("WFH"),
        v.literal("freelance")
      ),
      start: v.string(),
      end: v.optional(v.string()),
    })
  )),
  skills: v.optional(v.array(
    v.object({
      skill: v.string(),
      level: v.union(
        v.literal("Beginner"),
        v.literal("Intermediate"),
        v.literal("Advanced"),
        v.literal("Proficient"),
        v.literal("Expert"),
        v.literal("Master")
      )
    })
  )),
  socials: v.optional(v.object({
    linkedIn: v.optional(v.string()),
    github: v.optional(v.string()),
    twitter: v.optional(v.string()),
  }))
})

const schema = defineSchema({...authTables, profile});

export default schema;
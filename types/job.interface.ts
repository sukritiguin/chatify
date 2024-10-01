// src/types/job.interface.ts

import { Id } from "../convex/_generated/dataModel";

export interface SalaryRange {
  min: number;
  max?: number;
  currency: string;
}

export interface Job {
  _id: Id<"jobs">;
  userId: Id<"users">; // Reference to the organization (user)
  title: string;
  description: string;
  location: string;
  employmentType: "full_time" | "part_time" | "contract" | "internship" | "temporary" | "freelance";
  salaryRange?: SalaryRange; // Optional salary range object
  skills: string[]; // List of required skills
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "director" | "executive";
  postedBy: Id<"users">; // Reference to the user who posted the job
  createdAt: string; // Date in string format
  updatedAt?: string; // Optional update date
  isActive: boolean; // Status of the job posting
}

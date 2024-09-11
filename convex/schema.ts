import { authTables } from "@convex-dev/auth/server"; // Importing auth tables from Convex
import { defineSchema, defineTable } from "convex/server"; // Importing functions to define schema and tables
import { v } from "convex/values"; // Importing value validators

const otp = defineTable({
  id: v.string(),
  code: v.string(),
})

// Define the users table
const users = defineTable({
  // Include fields from authTables.users
  id: v.optional(v.id("users")), // Unique identifier for each user, provide table name here
  email: v.optional(v.string()), // User's email, optional
  emailVerificationTime: v.optional(v.float64()), // Optional timestamp for email verification
  image: v.optional(v.string()), // Optional URL for user image
  isAnonymous: v.optional(v.boolean()), // Indicates if the user is anonymous
  name: v.optional(v.string()), // Optional field for user's name
  phone: v.optional(v.string()), // Optional phone number
  phoneVerificationTime: v.optional(v.float64()), // Optional timestamp for phone verification
  password: v.optional(v.string()), // User's password (should be hashed)
  createdAt: v.optional(v.number()), // Change from v.number() to v.optional(v.number())

  updatedAt: v.optional(v.number()), // Optional timestamp for updates
  isActive: v.optional(v.boolean()), // Indicates if the user account is active
  role: v.optional(v.string()), // Optional field for user role (e.g., admin, user)
  lastLogin: v.optional(v.number()), // Optional timestamp for last login time
})
  .index("email", ["email"]) // Index for email
  .index("phone", ["phone"]); // Index for phone

// Define the schema including the users table and other auth tables
const schema = defineSchema({
  ...authTables, // Include existing auth tables from Convex
  users, // Custom users table with added fields and indexes
  otp
});

// Export the schema
export default schema;

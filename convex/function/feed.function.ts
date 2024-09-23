import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const insertPost = mutation({
  args: {
    data: v.object({
      content: v.string(),
      media: v.optional(v.array(v.string())), // Optional media field
      visibility: v.union(
        v.literal("public"),
        v.literal("connections"),
        v.literal("private")
      ), // Visibility options matching your schema
    }),
  },
  async handler(ctx, args_0) {
    const { data } = args_0;

    // Get the authenticated user ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized access");
    }

    // Create the post object, ensuring it aligns with the schema
    const dataObject = {
      userId, // Correctly reference the user ID
      content: data.content, // Text content of the post
      media: data.media || [], // Media array, default to empty array if not provided
      createdAt: new Date().toISOString(), // Use ISO strings for timestamps
      updatedAt: new Date().toISOString(), // Same for updatedAt
      visibility: data.visibility, // Public, connections, or private

      // Optional reactions object with int64 counts
      reactions: {
        like: 0n, // Start with 0 reactions
        celebrate: 0n,
        support: 0n,
        insightful: 0n,
        love: 0n,
        funny: 0n,
        sad: 0n,
      },

      // Optional counts
      commentCount: 0n,
      shareCount: 0n,

      // Post promotion (false for now)
      isPromoted: false,

      // Null sharedPostId for non-shared posts
      sharedPostId: "", // Use "" for no shared post reference, // TODO: Must be done later to handle repost/share
    };

    // Insert the post into the "posts" table
    await ctx.db.insert("posts", dataObject);
  },
});

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (!posts) return null;

    const allPosts = [];

    for (let i = 0; i < posts.length; i++) {
      allPosts.push({
        profile: await ctx.db
          .query("profile")
          .filter((q) => q.eq(q.field("userId"), posts[i].userId))
          .first(),
        post: posts[i],
      });
    }

    return allPosts;
  },
});

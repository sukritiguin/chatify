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
        organization: await ctx.db
          .query("organizations")
          .filter((q) => q.eq(q.field("adminUserId"), posts[i].userId))
          .first(),
        post: posts[i],
      });
    }

    return allPosts;
  },
});

export const likePost = mutation({
  args: {
    postId: v.id("posts"),
    reactionType: v.union(
      v.literal("Celebrate"),
      v.literal("Support"),
      v.literal("Insightful"),
      v.literal("Sad"),
      v.literal("Funny"),
      v.literal("Love"),
      v.literal("Like")
    ),
    increase: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const post = await ctx.db.get(args.postId);

    let updatedReaction:
      | {
          like: bigint;
          celebrate: bigint;
          support: bigint;
          insightful: bigint;
          love: bigint;
          funny: bigint;
          sad: bigint;
        }
      | undefined = post?.reactions;

    if (!updatedReaction) {
      updatedReaction = {
        like: 0n,
        love: 0n,
        funny: 0n,
        sad: 0n,
        insightful: 0n,
        support: 0n,
        celebrate: 0n,
      };
    }

    // Check the type of reaction and update the corresponding count
    if (args.reactionType === "Like") {
      if (args.increase) {
        updatedReaction.like = (updatedReaction.like || 0n) + 1n; // Increment if increasing
      } else {
        updatedReaction.like = (updatedReaction.like || 0n) - 1n; // Do nothing if not increasing
      }
    } else if (args.reactionType === "Love") {
      if (args.increase) {
        updatedReaction.love = (updatedReaction.love || 0n) + 1n;
      } else {
        updatedReaction.love = (updatedReaction.love || 0n) - 1n; // Do nothing if not increasing
      }
    } else if (args.reactionType === "Funny") {
      if (args.increase) {
        updatedReaction.funny = (updatedReaction.funny || 0n) + 1n;
      } else {
        updatedReaction.funny = (updatedReaction.funny || 0n) - 1n;
      }
    } else if (args.reactionType === "Sad") {
      if (args.increase) {
        updatedReaction.sad = (updatedReaction.sad || 0n) + 1n;
      } else {
        updatedReaction.sad = (updatedReaction.sad || 0n) - 1n;
      }
    } else if (args.reactionType === "Insightful") {
      if (args.increase) {
        updatedReaction.insightful = (updatedReaction.insightful || 0n) + 1n;
      } else {
        updatedReaction.insightful = (updatedReaction.insightful || 0n) - 1n;
      }
    } else if (args.reactionType === "Support") {
      if (args.increase) {
        updatedReaction.support = (updatedReaction.support || 0n) + 1n;
      } else {
        updatedReaction.support = (updatedReaction.support || 0n) - 1n;
      }
    } else if (args.reactionType === "Celebrate") {
      if (args.increase) {
        updatedReaction.celebrate = (updatedReaction.celebrate || 0n) + 1n;
      } else {
        updatedReaction.celebrate = (updatedReaction.celebrate || 0n) - 1n;
      }
    } else {
      console.error(`Unknown reaction type: ${args.reactionType}`);
    }

    await ctx.db.patch(args.postId, { reactions: updatedReaction });

    const existingReaction = await ctx.db
      .query("postReactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    console.log({
      checkExistingReaction: existingReaction,
      postId: args.postId,
    });
    if (existingReaction) {
      await ctx.db.patch(existingReaction._id, {
        reactionType: args.reactionType,
      });
    } else {
      await ctx.db.insert("postReactions", {
        userId: userId,
        postId: args.postId,
        reactionType: args.reactionType,
        createdAt: new Date().toString(),
      });
    }
  },
});

export const getReaction = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const existingReaction = await ctx.db
      .query("postReactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    return existingReaction;
  },
});

export const getReactionCountByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const existingReactions = await ctx.db
      .query("postReactions")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    if (!existingReactions) return 0;

    return existingReactions.length;
  },
});

export const postComment = mutation({
  args: {
    data: v.object({
      postId: v.id("posts"), // The post this comment is associated with
      content: v.string(), // The text content of the comment
      parentId: v.optional(v.id("comments")), // ID of the parent comment for nested replies
      reactions: v.optional(
        v.object({
          like: v.int64(), // Number of likes
          celebrate: v.int64(), // Number of celebrates
          support: v.int64(), // Number of supports
          insightful: v.int64(), // Number of insightful reactions
          love: v.int64(), // Number of loves
          funny: v.int64(), // Number of funny
          sad: v.int64(), // Number of sad
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const validatedData = {
      postId: data.postId,
      userId: userId,
      content: data.content,
      parentId: data.parentId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      reactions: data.reactions,
    };

    await ctx.db.insert("comments", validatedData);
  },
});

export const getCommentByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();

    const allComments = [];

    for (const comment of comments) {
      if (comment.parentId !== undefined) continue;
      const replies = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("parentId"), comment._id))
        .collect();

      const profile = await ctx.db
        .query("profile")
        .filter((q) => q.eq(q.field("userId"), comment.userId))
        .first();
      const organization = await ctx.db
        .query("organizations")
        .filter((q) => q.eq(q.field("adminUserId"), comment.userId))
        .first();

      const allReplies = [];

      for (const reply of replies) {
        const profile = await ctx.db
          .query("profile")
          .filter((q) => q.eq(q.field("userId"), reply.userId))
          .first();
        const organization = await ctx.db
          .query("organizations")
          .filter((q) => q.eq(q.field("adminUserId"), reply.userId))
          .first();

        if (profile) {
          allReplies.push({
            comment: reply,
            user: {
              avatar: profile.profilePhoto,
              name: profile.name,
              userId: profile.userId,
            },
          });
        } else if (organization) {
          allReplies.push({
            comment: reply,
            user: {
              avatar: organization.logo,
              name: organization.name,
              userId: organization.adminUserId,
            },
          });
        }
      }

      if (profile) {
        allComments.push({
          comment: comment,
          user: {
            avatar: profile.profilePhoto,
            name: profile.name,
            userId: profile.userId,
          },
          replies: allReplies,
        });
      } else if (organization) {
        allComments.push({
          comment: comment,
          user: {
            avatar: organization.logo,
            name: organization.name,
            userId: organization.adminUserId,
          },
          replies: allReplies,
        });
      }
    }

    return allComments;
  },
});

export const totalCommentsByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const count = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    const total = count.length;

    return total;
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    try {
      await ctx.db.delete(args.postId);
    } catch (error) {
      throw new Error("unable to delete post");
    }
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    try {
      await ctx.db.delete(args.commentId);
      const replies = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("parentId"), args.commentId))
        .collect();

      for (const reply of replies) {
        await ctx.db.delete(reply._id);
      }
    } catch (error) {
      throw new Error("unable to delete post");
    }
  },
});

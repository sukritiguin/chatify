import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getExistingConversationByConversationId = query({
  args: { conversationId: v.id("conversation") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const conversation = await ctx.db.get(args.conversationId);

    return conversation;
  },
});

export const checkExistingConversation = query({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const check = await ctx.db
      .query("conversation")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("firstUser"), userId),
            q.eq(q.field("secondUser"), args.receiverId)
          ),
          q.and(
            q.eq(q.field("firstUser"), args.receiverId),
            q.eq(q.field("secondUser"), userId)
          )
        )
      )
      .first();
    return check ? check._id : null;
  },
});

export const addNewConversation = mutation({
  args: {
    receiverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const conversation = await ctx.db.insert("conversation", {
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      avatar: undefined,
      title: "New Conversation",
      isGroupChat: false,
      firstUser: userId,
      secondUser: args.receiverId,
    });

    return conversation;
  },
});

export const createNewMessage = mutation({
  args: {
    conversationId: v.id("conversation"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      content: args.content,
      // media: [],
      updatedAt: new Date().toString(),
      createdAt: new Date().toString(),
      senderId: userId,
    });
  },
});

export const getMessageByConversationId = query({
  args: { conversationId: v.id("conversation") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();

    return messages;
  },
});

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const insertNotification = mutation({
  args: {
    userId: v.id("users"), // The user who receives the notification
    type: v.union(
      v.literal("like"), // User liked a post
      v.literal("comment"), // User commented on a post
      v.literal("share"), // User shared a post
      v.literal("mention"), // User was mentioned in a post or comment
      v.literal("connection_request"), // Received a connection request
      v.literal("connection_accept"), // Connection request accepted
      v.literal("endorsement"), // User was endorsed for a skill
      v.literal("profile_view"), // User's profile was viewed
      v.literal("job_posted"), // A job relevant to the user was posted
      v.literal("event_invitation"), // Invited to an event
      v.literal("group_invitation"), // Invited to join a group
      v.literal("article_recommendation"), // Recommended an article
      v.literal("announcement") // Platform announcements or updates
    ),
    referanceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const data = {
      userId: args.userId, // The user who receives the notification
      type: args.type,
      referanceUrl: args.referanceUrl,
      fromUserId: userId,
      createdAt: new Date().toString(), // Timestamp when the notification was created
      isRead: false, // Whether the notification has been read
    };

    console.log({ "notification data": data });
    const insertedNotification = await ctx.db.insert("notifications", data);
    console.log({ "notification data": insertedNotification });
  },
});

export const getNotificationsForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("asc")
      .collect();

    return notifications;
  },
});

export const readNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const countUnreadNotificationsOfcurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const count = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), userId), q.eq(q.field("isRead"), false))
      )
      .collect();

    if (!count) return 0;
    return count.length;
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized access!");

    ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()
      .then((notifications) => {
        // Return a promise for marking all notifications as read
        return Promise.all(
          notifications.map((notification) =>
            ctx.db.patch(notification._id, { isRead: true })
          )
        );
      })
      .then(() => {
        console.log("All notifications marked as read.");
      })
      .catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
  },
});

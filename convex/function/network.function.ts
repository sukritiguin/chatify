import { ConnectionType } from "./../../types/network.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPeopleYouMayKnow = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const suggestedProfiles = new Map();

    const userProfile = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    console.log("User profile while giving suggestion: ", userProfile);

    const allOrgnizations = new Set();

    if (userProfile.educations) {
      for (const education of userProfile.educations) {
        allOrgnizations.add(education.institute);
      }
    }

    if (userProfile.experiences) {
      for (const company of userProfile.experiences) {
        allOrgnizations.add(company.company);
      }
    }

    for (const organization of allOrgnizations) {
      suggestedProfiles.set(organization, []);
      const profiles = await ctx.db.query("profile").collect();

      for (const profile of profiles) {
        if (profile.userId == userId) continue;
        const educations = profile.educations || [];
        const experiences = profile.experiences || [];

        let isMatched = false;

        for (const education of educations) {
          if (education.institute === organization) {
            suggestedProfiles.set(organization, [
              ...suggestedProfiles.get(organization),
              {
                userId: profile.userId,
                cover: profile.coverPhoto,
                avatar: profile.profilePhoto,
                name: profile.name,
                bio: profile.bio,
              },
            ]);
            isMatched = true;
            break;
          }
        }

        if (!isMatched) {
          for (const experience of experiences) {
            if (experience.company === organization) {
              suggestedProfiles.set(organization, [
                ...suggestedProfiles.get(organization),
                {
                  userId: profile.userId,
                  cover: profile.coverPhoto,
                  avatar: profile.profilePhoto,
                  name: profile.name,
                  bio: profile.bio,
                },
              ]);
              break;
            }
          }
        }
      }

      if (suggestedProfiles.get(organization).length === 0) {
        suggestedProfiles.delete(organization);
      }
    }

    return Object.fromEntries(suggestedProfiles.entries());
  },
});

export const sendConnectRequest = mutation({
  args: { connectionRequestReceiverUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    await ctx.db.insert("connection", {
      sender: userId,
      receiver: args.connectionRequestReceiverUserId,
      status: "pending",
    });
  },
});

export const getStatusOfConnectionRequest = query({
  args: { connectionRequestReceiverUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const data = await ctx.db
      .query("connection")
      .filter((q) =>
        q.and(
          q.eq(q.field("sender"), userId),
          q.eq(q.field("receiver"), args.connectionRequestReceiverUserId)
        )
      )
      .first();

    return data;
  },
});

export const getAllConnectionRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    const connections = await ctx.db
      .query("connection")
      .filter((q) =>
        q.and(
          q.eq(q.field("receiver"), userId),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    return connections;
  },
});

export const acceptOrRejectConnectionRequest = mutation({
  args: {
    connectionId: v.id("connection"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access!");
    }

    if (args.status === "rejected") {
      await ctx.db.delete(args.connectionId);
      return;
    }

    await ctx.db.patch(args.connectionId, {
      status: args.status,
    });
  },
});

export const getMutualConnections = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized Access!");
    }

    const myConnections = await ctx.db
      .query("connection")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("receiver"), userId),
            q.eq(q.field("sender"), userId)
          ),
          q.eq(q.field("status"), "accepted")
        )
      )
      .collect()
      .then((connections: ConnectionType[]) => {
        return connections.map((connection: ConnectionType) => {
          return connection.receiver === userId
            ? connection.sender
            : connection.receiver;
        });
      });

    const usersConnections = await ctx.db
      .query("connection")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("receiver"), args.userId),
            q.eq(q.field("sender"), args.userId)
          ),
          q.eq(q.field("status"), "accepted")
        )
      )
      .collect()
      .then((connections: ConnectionType[]) => {
        return connections.map((connection: ConnectionType) => {
          return connection.receiver === args.userId
            ? connection.sender
            : connection.receiver;
        });
      });

    const commonConnections = myConnections.filter((userId) =>
      usersConnections.includes(userId)
    );

    if (commonConnections.length === 0) {
      return undefined;
    }

    const firstCommonProfile = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), commonConnections[0]))
      .first();

    const result = {
      avatar: firstCommonProfile?.profilePhoto,
      name: firstCommonProfile?.name,
      totalMututalConnections: commonConnections.length,
    };
    return result;
  },
});

import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCommonDetails = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const registeredAs = await ctx.db
      .query("registeredAs")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (registeredAs && registeredAs.type === "profile") {
      const profile = await ctx.db
        .query("profile")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (!profile) return null;

      const result = {
        userId: profile.userId,
        name: profile.name,
        bio: profile.bio,
        avatar: profile.profilePhoto,
      };
      return result;
    } else if (registeredAs?.type === "organization") {
      const organization = await ctx.db
        .query("organizations")
        .filter((q) => q.eq(q.field("adminUserId"), userId))
        .first();

      if (!organization) return null;

      const result = {
        userId: organization.adminUserId,
        name: organization.name,
        bio: organization.description,
        avatar: organization.logo,
      };

      return result;
    }

    return null;
  },
});

export const allProfileAndOrganizationProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const profiles = (await ctx.db.query("profile").collect()).map((value) => ({
      userId: value.userId,
      name: value.name,
      avatar: value.profilePhoto,
      profileUrl: `/profile/${value.userId}`,
      bio: value.bio,
    }));

    const organizations = (await ctx.db.query("organizations").collect()).map(
      (value) => ({
        userId: value.adminUserId,
        name: value.name,
        avatar: value.logo,
        profileUrl: `/organization/${value.adminUserId}`,
        bio: value.description,
      })
    );

    const result = [...profiles, ...organizations];

    return result;
  },
});

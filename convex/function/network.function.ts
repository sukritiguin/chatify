import { query } from "../_generated/server";
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

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { LinkedInProfileCard } from "../components/LinkedInProfileCard";
import { mapConvexDataToUserProfile } from "../page";

export const ProfileCard = ({ params }: { params: { profileId: string } }) => {
  const profile = useQuery(api.queries.getUserProfileById, {
    userId: params.profileId as Id<"users">,
  });
  return <LinkedInProfileCard profile={mapConvexDataToUserProfile(profile)} profileId={"" as Id<"users">} />;
};

export default ProfileCard;

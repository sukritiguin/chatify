"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { LinkedInProfileCard } from "../components/LinkedInProfileCard";
import { mapConvexDataToUserProfile } from "../page";

export const ProfileCard = ({ params }: { params: { profileId: string } }) => {
  const profile = useQuery(api.queries.getUserProfileById, {
    userId: params.profileId as Id<"users">,
  });
  const insertNotification = useMutation(api.queries.insertNotification);

  const currentUserId = useQuery(api.queries.currentUserId);
  const userRegistration = useQuery(api.queries.getUserRegistration);

  const [notificationInserted, setNotificationInserted] = useState(false);

  useEffect(() => {
    if (
      userRegistration?.type === "profile" && 
      !notificationInserted && 
      currentUserId
    ) {
      // Insert notification only once
      insertNotification({
        userId: params.profileId as Id<"users">,
        type: "profile_view",
        referanceUrl: `/profile/${currentUserId}`,
      }).then(() => {
        setNotificationInserted(true); // Prevent further insertions
      });
    }
  }, [userRegistration, notificationInserted, currentUserId, params.profileId, insertNotification]);

  return (
    <LinkedInProfileCard
      profile={mapConvexDataToUserProfile(profile)}
      profileId={"" as Id<"users">}
    />
  );
};

export default ProfileCard;

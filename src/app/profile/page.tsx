"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ProfilePage = () => {
  const profile = useQuery(api.queries.getUserProfile);

  if (profile === null) {
    return <div>No profile found.</div>;
  }

  return <div>{profile?.bio}</div>;
};

export default ProfilePage;

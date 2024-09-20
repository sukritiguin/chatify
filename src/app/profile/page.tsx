/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";

import { Profile } from "../../../types/profile.interface";

// import ProfileCard from "./components/ProfileCard";
import { LinkedInProfileCard } from "./components/LinkedInProfileCard";

// Function to map Convex data to the UserProfile interface
function mapConvexDataToUserProfile(profileData: any): Profile {
  if (profileData == null) {
    return {
      name: "",
      bio: "",
      coverPhoto: "",
      profilePhoto: "",
      educations: [], // Empty array for educations
      experiences: [], // Empty array for experiences
      skills: [], // Empty array for skills
      socials: {
        github: "",
        linkedIn: "",
        twitter: "",
      },
    };
  }
  return {
    // _creationTime: profileData._creationTime,
    // _id: profileData._id.id, // Convert Id<"profile"> to string
    // userId: profileData.userId.id, // Convert Id<"users"> to string
    name: profileData.name,
    bio: profileData.bio ?? "", // Handle optional fields with fallback
    coverPhoto: profileData.coverPhoto ?? "",
    profilePhoto: profileData.profilePhoto ?? "",
    educations:
      profileData.educations?.map((education: any) => ({
        institute: education.institute,
        course: education.course,
        start: education.start,
        end: education.end,
        story: education.story ?? "", // Fallback for optional story field
      })) ?? [], // Default to empty array if undefined
    experiences:
      profileData.experiences?.map((experience: any) => ({
        company: experience.company,
        designation: experience.designation,
        type: experience.type ?? "", // Default to empty string if type is undefined
        start: experience.start,
        end: experience.end ?? "", // Default to empty string if end is undefined
      })) ?? [], // Default to empty array if undefined
    skills:
      profileData.skills?.map((skill: any) => ({
        skill: skill.skill,
        level: skill.level ?? "", // Handle optional level
      })) ?? [], // Default to empty array if undefined
    socials: {
      github: profileData.socials?.github ?? "",
      linkedIn: profileData.socials?.linkedIn ?? "",
      twitter: profileData.socials?.twitter ?? "",
    },
  };
}

const ProfilePage = () => {
  const profile = useQuery(api.queries.getUserProfile);

  if (profile === null) {
    return <div>No profile found.</div>;
  }

  console.log(profile);
  const profileData = mapConvexDataToUserProfile(profile);
  const profileId = profile?._id as string;
  console.log(profileData);

  return (
    <>
      {/* <ProfileCard profileData={profileData} /> */}
      <LinkedInProfileCard profile={profileData} profileId={profileId} />
      {/* <div>Hello from profile</div> */}
    </>
  );
};

export default ProfilePage;

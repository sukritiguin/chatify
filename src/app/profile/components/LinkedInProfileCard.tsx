"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { FaPen } from "react-icons/fa";

import { BannerUpdate } from "./edits/ui/BannerUpdate";

import SkillCard from "./SkillCard";
import SocialsCard from "./SocialsCard";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";

import { Profile } from "../../../../types/profile.interface";
import { AiFillMessage } from "react-icons/ai";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

// Utility function to format date and calculate duration
const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(); // Use current date if endDate is not provided

  // Format start and end date to "MMM YYYY"
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  const formattedStart = start.toLocaleDateString(undefined, options);
  const formattedEnd = end.toLocaleDateString(undefined, options);

  // Calculate the duration in months
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return `${formattedStart} - ${formattedEnd} · ${months} mos`;
};

export const LinkedInProfileCard = ({
  profile,
  profileId,
}: {
  profile: Profile;
  profileId: string;
}) => {
  const router = useRouter(); // Get router instance
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [conversationId, setConversationId] = useState<Id<"conversation">>();

  const existingConversation = useQuery(api.queries.checkExistingConversation, {
    receiverId: profile.userId as Id<"users">,
  });

  const createNewConversation = useMutation(api.queries.addNewConversation);

  const createNewConversationFun = async () => {
    try {
      const newConversationId = await createNewConversation({
        receiverId: profile.userId as Id<"users">,
      });
      setConversationId(newConversationId); // Set the resolved value
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  useEffect(() => {
    if (existingConversation) {
      setConversationId(existingConversation);
    } else if (existingConversation !== undefined) {
      createNewConversationFun();
    }
  }, [existingConversation, profile.userId, createNewConversation]);

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100">
        <div className="relative bg-white p-4 my-10 rounded-lg shadow-lg w-[75%] max-w-[1800px]">
          {/* Cover Photo */}
          <Image
            src={profile?.coverPhoto as string}
            alt="profile cover image"
            width={1200} // Adjust width as needed
            height={400} // Adjust height as needed
            className="rounded-lg w-full"
          />
          {/* Edit Icon */}
          {profileId && (
            <div className="">
              <div
                className="absolute right-4 top-4 cursor-pointer mt-1 mr-1"
                onClick={() => setIsBannerDialogOpen(true)}
              >
                <FaPen
                  className="text-blue-500 hover:text-blue-800 bg-white p-2 rounded-full"
                  size={24}
                />
              </div>
              <BannerUpdate
                isOpen={isBannerDialogOpen}
                setIsOpen={setIsBannerDialogOpen}
              />
            </div>
          )}
          {/* Profile Photo (absolute positioned) */}
          <div className="flex -mt-12 ml-2 left-8 -bottom-12">
            <Image
              src={profile?.profilePhoto as string}
              alt="profile image"
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
            />
          </div>
          {/* Name below the profile photo */}
          <div className="flex flex-col items-start">
            <h2 className="text-black text-3xl font-bold">{profile.name}</h2>
            <p className="text-black">{profile?.bio}</p>
          </div>
          <div
            className="flex text-3xl text-blue-600 hover:text-blue-700 hover:cursor-pointer"
            onClick={() => {
              console.log("On Click start conversation: ", conversationId);
              router.push(`/message/${conversationId}`);
            }}
          >
            {!profileId && <AiFillMessage />}
          </div>
          {/* Experience Section */}
          <ExperienceCard
            experience={profile.experiences}
            formatDateRange={formatDateRange}
            profileId={profileId}
          />
          <EducationCard
            educations={profile.educations}
            formatDateRange={formatDateRange}
          />
          <SkillCard skills={profile.skills} />
          <SocialsCard socials={profile.socials} />
        </div>
      </div>
    </>
  );
};

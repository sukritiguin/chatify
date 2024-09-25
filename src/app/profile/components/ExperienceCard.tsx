/* eslint-disable @typescript-eslint/no-explicit-any */
// ExperienceCard.tsx
"use client";

import React, { useState } from "react";
import { FaPen } from "react-icons/fa"; // Icon for experience

import { ExperienceUpdate } from "./edits/ui/ExperienceUpdate";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Experience {
  company: string;
  designation: string;
  start: string;
  end?: string; // Optional
  story?: string; // Optional description of the experience
  type?:
    | "fulltime"
    | "internship"
    | "apprenticeship"
    | "parttime"
    | "WFH"
    | "freelance"
    | "";
}

interface Organization {
  name?: string;
  description?: string;
  website?: string;
  banner?: string;
  logo?: string;
  industry?: string;
  address?: string;
  established?: string;
}

interface ExperienceCardProps {
  experience: Experience[] | undefined;
  formatDateRange: (startDate: string, endDate?: string) => string;
  profileId: string;
}

const SingleExperienceCard = ({
  exp,
  index,
  formatDateRange,
  profileId,
  isExperienceDialogOpen,
  setIsExperienceDialogOpen,
}: {
  exp: any;
  index: number;
  formatDateRange: any;
  profileId: any;
  isExperienceDialogOpen: boolean;
  setIsExperienceDialogOpen: any;
}) => {
  const organization = useQuery(api.queries.getOrganizationById, {
    organizationId: exp.company as Id<"organizations">,
  });

  return (
    <div
      key={index}
      className="flex items-center bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Company Logo */}
      <div className="flex items-center justify-center bg-gray-700 rounded-full h-16 w-16 text-3xl font-bold text-white mr-4 shadow-md">
        <Avatar>
          <AvatarImage src={organization?.logo || ""} alt="@shadcn" />
          <AvatarFallback>
            {organization?.name?.toLocaleUpperCase()[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <h4 className="text-lg text-white font-semibold hover:underline cursor-pointer">
          {organization?.name}
        </h4>
        <p className="text-sm font-light text-gray-200">{exp.designation}</p>
        <p className="text-sm text-gray-300">
          {formatDateRange(exp.start, exp.end)}
        </p>
        {/* Work Type Display */}
        {exp.type && (
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-semibold text-white rounded-full ${
              exp.type === "fulltime"
                ? "bg-green-500"
                : exp.type === "internship"
                  ? "bg-blue-500"
                  : exp.type === "apprenticeship"
                    ? "bg-yellow-500"
                    : exp.type === "parttime"
                      ? "bg-orange-500"
                      : exp.type === "WFH"
                        ? "bg-purple-500"
                        : exp.type === "freelance"
                          ? "bg-teal-500"
                          : "bg-gray-500"
            }`}
          >
            {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
          </span>
        )}
        {exp.story && <p className="mt-2 text-gray-100 italic">{exp.story}</p>}
      </div>
      {profileId && (
        <FaPen
          className="text-yellow-400 cursor-pointer hover:text-yellow-500"
          onClick={() => {
            console.log({
              profileId: profileId,
              exp: exp,
            });
            setIsExperienceDialogOpen(true);
          }}
        />
      )}
      <ExperienceUpdate
        isOpen={isExperienceDialogOpen}
        setIsOpen={setIsExperienceDialogOpen}
        experienceIndex={index}
        experience={exp}
      />
    </div>
  );
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  formatDateRange,
  profileId,
}) => {
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);

  if (!experience)
    return <h1 className="text-center text-red-500">No Experience</h1>;

  return (
    <div className="mt-5">
      <h3 className="text-xl text-gray-950 font-bold">Experience</h3>
      <div className="mt-4 space-y-4">
        {experience.map((exp, index) => (
          <SingleExperienceCard
            key={index}
            exp={exp}
            index={index}
            formatDateRange={formatDateRange}
            profileId={profileId}
            isExperienceDialogOpen={isExperienceDialogOpen}
            setIsExperienceDialogOpen={setIsExperienceDialogOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceCard;

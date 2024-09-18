// ExperienceCard.tsx

import React, { useState } from "react";
import { FaBriefcase, FaPen } from "react-icons/fa"; // Icon for experience

import { ExperienceUpdate } from "./edits/ui/ExperienceUpdate";

interface Experience {
  company: string;
  designation: string;
  start: string;
  end?: string; // Optional
  story?: string; // Optional description of the experience
}

interface ExperienceCardProps {
  experience: Experience[] | undefined;
  formatDateRange: (startDate: string, endDate?: string) => string;
  profileId: string;
}

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
          <div
            key={index}
            className="flex items-center bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Company Logo */}
            <div className="flex items-center justify-center bg-gray-700 rounded-full h-16 w-16 text-3xl font-bold text-white mr-4 shadow-md">
              <FaBriefcase />
            </div>
            <div className="flex-1">
              <h4 className="text-lg text-white font-semibold hover:underline cursor-pointer">
                {exp.company}
              </h4>
              <p className="text-sm font-light text-gray-200">
                {exp.designation}
              </p>
              <p className="text-sm text-gray-300">
                {formatDateRange(exp.start, exp.end)}
              </p>
              {exp.story && (
                <p className="mt-2 text-gray-100 italic">{exp.story}</p>
              )}
            </div>
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
            <ExperienceUpdate
              isOpen={isExperienceDialogOpen}
              setIsOpen={setIsExperienceDialogOpen}
              experienceIndex={index}
              experience={exp}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceCard;

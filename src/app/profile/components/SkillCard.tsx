// Skills.tsx

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Example icons for skill levels

export interface Skill {
  skill: string;
  level?:
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Proficient"
    | "Expert"
    | "Master"
    | "";
}

interface SkillsProps {
  skills: Skill[] | undefined; // Accept an array of skills
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const getLevelIcon = (level?: string) => {
    switch (level) {
      case "Beginner":
        return <FaRegStar className="text-yellow-500" />;
      case "Intermediate":
        return (
          <>
            <FaStar className="text-yellow-500" />
            <FaRegStar className="text-yellow-500" />
          </>
        );
      case "Advanced":
        return (
          <>
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaRegStar className="text-yellow-500" />
          </>
        );
      case "Proficient":
        return (
          <>
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaRegStar className="text-yellow-500" />
          </>
        );
      case "Expert":
        return (
          <>
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaRegStar className="text-yellow-500" />
          </>
        );
      case "Master":
        return (
          <>
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
          </>
        );
      default:
        return null;
    }
  };

  if (!skills || skills.length === 0) return <h1>No Skills</h1>;

  return (
    <div className="mt-5">
      <h3 className="text-xl text-gray-950 font-bold">Skills</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            {/* Skill Icon */}
            <div className="flex items-center justify-center bg-white rounded-full h-12 w-12 text-2xl font-bold text-gray-700 mb-2">
              {skill.skill.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-sm text-white font-semibold">{skill.skill}</h4>
            <div className="flex items-center mt-1">
              {getLevelIcon(skill.level)} {/* Display skill level icons */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;

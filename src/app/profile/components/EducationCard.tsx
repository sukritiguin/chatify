// EducationList.tsx

import React from "react";
import { FaGraduationCap } from "react-icons/fa"; // Icon for education

interface Education {
  institute: string;
  course: string;
  start: string;
  end?: string; // Optional to allow for ongoing education
  story?: string;
}

interface EducationListProps {
  educations: Education[] | undefined; // Accept an array of education entries
  formatDateRange: (startDate: string, endDate?: string) => string;
}

const EducationList: React.FC<EducationListProps> = ({
  educations,
  formatDateRange,
}) => {
  if (!educations) return <h1 className="text-center text-red-500">No Education</h1>;

  return (
    <div className="mt-5">
      <h3 className="text-xl text-gray-950 font-bold">Education</h3>
      <div className="mt-4 space-y-4">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="flex items-center bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Institution Logo */}
            <div className="flex items-center justify-center bg-gray-700 rounded-full h-16 w-16 text-3xl font-bold text-white mr-4 shadow-md">
              <FaGraduationCap />
            </div>
            <div className="flex-1">
              <h4 className="text-lg text-white font-semibold hover:underline cursor-pointer">
                {edu.institute}
              </h4>
              <p className="text-sm font-light text-gray-200">{edu.course}</p>
              <p className="text-sm text-gray-300">
                {formatDateRange(edu.start, edu.end)}
              </p>
              {edu.story && (
                <p className="mt-2 text-gray-100 italic">{edu.story}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationList;

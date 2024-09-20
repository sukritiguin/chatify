import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaTrash, FaCalendarAlt, FaUniversity, FaBook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Education } from "../../../../../types/profile.interface";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Id } from "../../../../../convex/_generated/dataModel";

const EducationCard = ({
  education,
  index,
  removeEducation,
}: {
  education: Education; // Use the Education interface here
  index: number; // Assuming index is a number
  removeEducation: (index: number) => void; // Define removeEducation function type
}) => {
  const organization = useQuery(api.queries.getOrganizationById, {organizationId: education.institute as Id<"organizations">});

  if(organization === undefined) {
    return <Loader />;
  }

  console.log({organization})

  return (
    <Card className="mb-6 p-6 shadow-lg rounded-lg bg-gradient-to-r from-green-100 to-green-300 hover:shadow-2xl transition-shadow duration-200 ease-in-out">
      <CardContent>
        <div className="space-y-4">
          {/* Institute */}
          <div className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
            <FaUniversity className="text-gray-500 text-2xl" />
            <span className="flex-grow"><Link href={`/organization/${education.institute}`}>{organization?.name}</Link></span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50"
              onClick={() => removeEducation(index)}
            >
              <FaTrash className="mr-1" /> Delete
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Course */}
          <div className="flex items-center space-x-3 text-md font-medium text-gray-700">
            <FaBook className="text-gray-500 text-lg" />
            <span>{education.course}</span>
          </div>

          {/* Dates */}
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <span>{education.start}</span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <span>{education.end}</span>
            </div>
          </div>

          {/* Story */}
          {education.story && (
            <div className="text-sm text-gray-600">{education.story}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationCard;

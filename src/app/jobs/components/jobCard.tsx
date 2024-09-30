// src/components/JobCard.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Job } from "../../../../types/job.interface";
import { ApplyJobModal } from "./ApplyJobModal";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {

  const [applyJobModalIsOpen, setApplyJobModalIsOpen] = useState<boolean>(false);

  const handleApply = () => {
    setApplyJobModalIsOpen(true);
    onApply(job.id);
  };

  return (
    <>
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex items-center space-x-4 p-4">
        {job.organizationLogoUrl ? (
          <Avatar>
            <AvatarImage src={job.organizationLogoUrl} alt={`${job.organizationName} logo`} />
            <AvatarFallback>{job.organizationName.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <FaStar className="text-white text-xl" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.organizationName}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-gray-700 mb-2">
          <FaMapMarkerAlt className="mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-700 mb-2">
          <FaBriefcase className="mr-1" />
          <span>{job.employmentType.replace("_", " ").toUpperCase()}</span>
        </div>
        {job.salaryRange && (
          <div className="flex items-center text-gray-700 mb-2">
            <FaDollarSign className="mr-1" />
            <span>
              {job.salaryRange.min} {job.salaryRange.currency}
              {job.salaryRange.max && ` - ${job.salaryRange.max} ${job.salaryRange.currency}`}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Experience Level:</h4>
          <p className="text-gray-600">{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={!job.isActive}
        >
          {job.isActive ? "Apply Now" : "Closed"}
        </Button>
      </CardFooter>
    </Card>

    <ApplyJobModal jobId={job.id} applyJobModalIsOpen={applyJobModalIsOpen} setApplyJobModalIsOpen={setApplyJobModalIsOpen}/>
    </>
  );
};

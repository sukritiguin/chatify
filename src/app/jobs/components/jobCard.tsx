// src/components/JobCard.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Job } from "../../../../types/job.interface";
import { ApplyJobModal } from "./ApplyJobModal";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [applyJobModalIsOpen, setApplyJobModalIsOpen] =
    useState<boolean>(false);

  const organization = useQuery(api.queries.getOrganizationByUserId, {
    userId: job.userId,
  });


  const handleApply = () => {
    setApplyJobModalIsOpen(true);
  };

  return (
    <>
      <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-lg border border-gray-200">
        {/* Card Header */}
        <CardHeader className="flex items-center space-x-3 p-3">
          {organization && organization.logo ? (
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={organization.logo}
                alt={`${organization.name} logo`}
              />
              <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <FaStar className="text-white text-lg" />
            </div>
          )}
          <div>
            <h3 className="text-md font-semibold text-gray-800">{job.title}</h3>
            <p className="text-md text-gray-500 hover:text-blue-500 hover:cursor-pointer hover:underline">
              <Link href={`/organization/${job.userId}`}>
                {organization?.name}
              </Link>
            </p>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex-1 px-3 pb-3">
          {/* Job Metadata */}
          <div className="flex flex-wrap text-gray-600 text-xs space-x-2">
            {/* Location */}
            <div className="flex items-center mr-2">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              <span>{job.location}</span>
            </div>
            {/* Employment Type */}
            <div className="flex items-center mr-2">
              <FaBriefcase className="mr-1 text-gray-400" />
              <span>{job.employmentType.replace("_", " ").toUpperCase()}</span>
            </div>
            {/* Salary Range */}
            {job.salaryRange && (
              <div className="flex items-center">
                <FaDollarSign className="mr-1 text-gray-400" />
                <span>
                  {job.salaryRange.min.toLocaleString()}{" "}
                  {job.salaryRange.currency}
                  {job.salaryRange.max &&
                    ` - ${job.salaryRange.max.toLocaleString()} ${job.salaryRange.currency}`}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Experience Level */}
          <div className="mt-2">
            <h4 className="text-xs font-semibold text-gray-700">
              Experience Level:
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {job.experienceLevel.replace("_", " ")}
            </p>
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex justify-between items-center p-3">
          <span className="text-xxs text-gray-500">
            Posted{" "}
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleApply}
            disabled={!job.isActive}
            className={`${
              job.isActive
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-semibold text-xs py-1 px-3 hover:text-white rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            {job.isActive ? "Apply Now" : "Closed"}
          </Button>
        </CardFooter>
      </Card>

      {/* Apply Job Modal */}
      <ApplyJobModal
        jobId={job._id}
        applyJobModalIsOpen={applyJobModalIsOpen}
        setApplyJobModalIsOpen={setApplyJobModalIsOpen}
      />
    </>
  );
};

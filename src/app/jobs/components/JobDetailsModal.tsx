/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/JobDetailsModal.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import DOMPurify from "dompurify"; // For sanitizing HTML content
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "../../../../types/job.interface";


// Define the props for the JobDetailsModal component
interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  job: Job | null;
  organization: any
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  isOpen,
  onClose,
  job,
  organization
}) => {
  if (!job) return null;

  // Sanitize the description to prevent XSS
  const sanitizedDescription = DOMPurify.sanitize(job.description);
  console.log(sanitizedDescription);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-3xl
          p-6
          bg-white
          rounded-lg
          shadow-lg
          max-h-[80vh]
          overflow-y-auto
        "
      >
        <DialogHeader className="flex items-center space-x-3 p-3">
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
        </DialogHeader>
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

        {/* Description */}
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Job Description
          </h3>
          <ReactQuill
            value={sanitizedDescription}
            readOnly={true}
            theme={"bubble"}
            className="text-gray-800"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;

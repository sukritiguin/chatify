// src/pages/jobs/index.tsx
"use client";

import React, { useState } from "react";
import { Job } from "../../../types/job.interface";
import { JobCard } from "./components/jobCard";
import { JobPostingModal } from "./components/JobPostingModal";

const mockJobs: Job[] = [
  {
    id: "job1",
    organizationName: "Tech Innovators Inc.",
    organizationLogoUrl: "https://example.com/logo1.png",
    title: "Frontend Developer",
    description: "We are looking for a skilled frontend developer...",
    location: "New York, NY",
    employmentType: "full_time",
    salaryRange: {
      min: 70000,
      max: 90000,
      currency: "USD",
    },
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experienceLevel: "mid",
    isActive: true,
    createdAt: "2024-04-20T10:00:00Z",
  },
  {
    id: "job2",
    organizationName: "Creative Solutions",
    // No logoUrl provided, will use default icon
    title: "UX Designer",
    description: "Join our dynamic team as a UX Designer...",
    location: "San Francisco, CA",
    employmentType: "contract",
    skills: ["Figma", "User Research", "Prototyping"],
    experienceLevel: "senior",
    isActive: false,
    createdAt: "2024-04-15T08:30:00Z",
  },
  // Add more job objects as needed
];

const JobsPage: React.FC = () => {
  const [isJobPostingModalOpen, setIsJobPostingModalOpen] =
    useState<boolean>(false);
  const handleApply = (jobId: string) => {
    // Implement the apply logic, e.g., open a modal, navigate to application form, etc.
    console.log(`Applying to job with ID: ${jobId}`);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl hover:cursor-pointer m-2" onClick={() => setIsJobPostingModalOpen(true)}>Post Job</h2>
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      </div>
      <div className=""><JobPostingModal isOpen={isJobPostingModalOpen} onClose={setIsJobPostingModalOpen}/></div>
    </>
  );
};

export default JobsPage;

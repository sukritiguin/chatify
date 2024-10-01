// src/pages/jobs/index.tsx
"use client";

import React, { useState } from "react";
import { Job } from "../../../types/job.interface";
import { JobPostingModal } from "./components/JobPostingModal";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { JobCard } from "./components/jobCard";

const JobsPage: React.FC = () => {
  const [isJobPostingModalOpen, setIsJobPostingModalOpen] = useState<boolean>(false);

  const allListedJobs = useQuery(api.queries.getAllActiveJobs);
  const getUserType = useQuery(api.queries.getUserRegistration)


  return (
    <>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Available Job Listings</h1>
          {getUserType?.type === "organization" && <button
            onClick={() => setIsJobPostingModalOpen(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaPlus className="mr-2" />
            Post a Job
          </button>}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allListedJobs && allListedJobs.length > 0 ? (
            allListedJobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No jobs available at the moment.</p>
          )}
        </div>
      </div>

      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={isJobPostingModalOpen}
        onClose={() => setIsJobPostingModalOpen(false)}
      />
    </>
  );
};

export default JobsPage;

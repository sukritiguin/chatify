// src/pages/jobs/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Job } from "../../../types/job.interface";
import { JobPostingModal } from "./components/JobPostingModal";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { JobCard } from "./components/jobCard";
import { SearchFilter } from "./components/SearchFilter";
import { JobListingModal } from "./components/JobListing";
import { FcDocument } from "react-icons/fc";

const JobsPage: React.FC = () => {
  const [isJobPostingModalOpen, setIsJobPostingModalOpen] =
    useState<boolean>(false);
  const [isJobListingModalOpen, setIsJobListingModalOpen] =
    useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>();

  const allListedJobs = useQuery(api.queries.getAllActiveJobs);
  const getUserType = useQuery(api.queries.getUserRegistration);

  useEffect(() => {
    setJobs(allListedJobs);
  }, [allListedJobs]);

  return (
    <>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Find Jobs
          </h1>
          {/* SearchFilter placed under h1 */}
          <SearchFilter jobs={jobs} setJobs={setJobs} />
        </div>

        {/* Post a Job Button */}
        {getUserType?.type === "organization" && (
          <div className="mb-6 flex">
            <button
              onClick={() => setIsJobPostingModalOpen(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" />
              Post a Job
            </button>
            <button
              onClick={() => setIsJobListingModalOpen(true)}
              className="flex ml-4 items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FcDocument className="mr-2" />
              Show Job Listing
            </button>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: Job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No jobs available at the moment.
            </p>
          )}
        </div>
      </div>

      {/* Job Posting Modal */}
      <JobPostingModal
        isOpen={isJobPostingModalOpen}
        onClose={() => setIsJobPostingModalOpen(false)}
      />

      {/* Job Listing Modal for Companies */}
      <JobListingModal
        isOpen={isJobListingModalOpen}
        setIsOpen={setIsJobListingModalOpen}
      />
    </>
  );
};

export default JobsPage;

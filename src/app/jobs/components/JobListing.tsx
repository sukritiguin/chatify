import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FiUsers, FiCalendar, FiLink } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface JobListingModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JobListingModal = ({
  isOpen,
  setIsOpen,
}: JobListingModalProps) => {
  const listedJobs: {
    jobId: Id<"jobs">;
    jobTitle: string;
    createdAt: string; // assuming job.createdAt is a Date object
    totalApplicants: number;
  }[] | undefined = useQuery(api.queries.getAllJobListing);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Job Listings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {!listedJobs ? (
            <p className="text-gray-600">No job listings available.</p>
          ) : (
            <ul className="space-y-6">
              {listedJobs.map((job) => (
                <li
                  key={job.jobId}
                  className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-medium text-gray-800">
                      {job.jobTitle}
                    </h3>
                    <div className="flex space-x-4 items-center text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiUsers className="mr-2 text-gray-500" />{" "}
                        {job.totalApplicants} applicants
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="mr-2 text-gray-500" />
                        {formatDistanceToNow(new Date(job.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <a
                      href={`/jobs/${job.jobId}/applications`}
                      className="inline-flex items-center text-blue-500 font-medium hover:text-blue-700 transition-colors"
                    >
                      <FiLink className="mr-1" />
                      View all applications
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

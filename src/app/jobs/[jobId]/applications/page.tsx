"use client";
import { useQuery } from "convex/react";
import { ApplicantCard } from "./components/ApplicantCard";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const ApplicationsPage = ({ params }: { params: { jobId: string } }) => {
  const applications = useQuery(api.queries.getAllApplications, {
    jobId: params.jobId as Id<"jobs">,
  });

  return (
    <>
      {applications &&
        applications.map((application) => {
          return (
            <ApplicantCard
              key={application._id}
              application={application}
            />
          );
        })}
    </>
  );
};

export default ApplicationsPage;

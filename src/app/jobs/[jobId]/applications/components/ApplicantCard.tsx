"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaFilePdf, FaRegCircleXmark } from "react-icons/fa6";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Link from "next/link";

interface ApplicantCardProps {
  application: {
    _id: Id<"applications">;
    _creationTime: number;
    updatedAt?: string | undefined;
    coverLetter?: string | undefined;
    status: "accepted" | "rejected" | "applied" | "shortlisted" | "hired";
    jobId: Id<"jobs">;
    applicantId: Id<"users">;
    resumeUrl: string;
    appliedAt: string;
  };
}

export const ApplicantCard = ({ application }: ApplicantCardProps) => {
  const userProfile = useQuery(api.queries.getUserProfileById, {
    userId: application.applicantId,
  });

  const shortListApplicant = useMutation(api.queries.shortListApplicant);

  const handleShortlistOrReject = async (isShortlisted: boolean) => {
    await shortListApplicant({
      applicationId: application._id,
      isShortlisted: isShortlisted,
    });
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="bg-gray-50 border-2 rounded-full p-4 flex justify-between items-center w-full">
        <div className="flex items-center">
          <Link
            href={`/profile/${application.applicantId}`}
            className="flex items-center"
          >
            <Avatar className="text-4xl">
              <AvatarImage src={userProfile?.profilePhoto} />
              <AvatarFallback>
                {userProfile?.name.toLocaleUpperCase().charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-3 text-2xl text-blue-600 font-semibold ">
              {userProfile?.name}
            </span>
          </Link>
        </div>
        <div className="flex justify-end space-x-12">
          <Link href={application.resumeUrl} target="_blank">
            <p className="justify-end hover:cursor-pointer">
              <FaFilePdf className="mx-auto text-2xl text-red-500" />
              <span className="font-bold">Resume</span>
            </p>
          </Link>
          <Link href={application?.coverLetter || ""} target="_blank">
            <p
              className={`justify-end ml-3 ${!(application.coverLetter === undefined || application.coverLetter === "") && `hover:cursor-pointer`}`}
            >
              <FaFilePdf
                className={`mx-auto text-2xl ${!(application.coverLetter === undefined || application.coverLetter === "") ? `text-red-600` : `text-gray-200`}`}
              />
              <span
                className={`font-bold ${!(application.coverLetter === undefined || application.coverLetter === "") ? `text-gray-800` : `text-gray-200`}`}
              >
                Cover Letter
              </span>
            </p>
          </Link>
          {application.status === "applied" && (
            <p
              className="justify-end ml-3 hover:cursor-pointer"
              onClick={() => handleShortlistOrReject(true)}
            >
              <FaRegCheckCircle className="mx-auto text-2xl text-green-600" />
              <span className="font-bold">Shortlist</span>
            </p>
          )}
          {application.status === "shortlisted" && (
            <p className="justify-end ml-3 hover:cursor-pointer">
              <FaCheckCircle className="mx-auto text-2xl text-green-300" />
              <span className="font-bold">Shortlisted</span>
            </p>
          )}
          {application.status === "applied" && (
            <p
              className="justify-end ml-3 hover:cursor-pointer"
              onClick={() => handleShortlistOrReject(false)}
            >
              <FaRegCircleXmark className="mx-auto text-2xl text-red-600" />
              <span className="font-bold">Reject</span>
            </p>
          )}
          {application.status === "rejected" && (
            <p className="justify-end ml-3 hover:cursor-pointer">
              <FaCircleXmark className="mx-auto text-2xl text-red-300" />
              <span className="font-bold">Rejected</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

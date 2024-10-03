// src/components/ApplyJobModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaPaperclip, FaTimes, FaUpload } from "react-icons/fa";
import { Id } from "../../../../convex/_generated/dataModel";
import { uploadPdfToCloudinary } from "@/lib/cloudinary.utility";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface ApplyJobModalProps {
  jobId: Id<"jobs">;
  applyJobModalIsOpen: boolean;
  setApplyJobModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  jobId,
  applyJobModalIsOpen,
  setApplyJobModalIsOpen,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Convex mutation for applying to a job

  const applyJob = useMutation(api.queries.applyJob);

  // Handle Resume File Selection
  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type and size (optional)
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed for the resume.");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  // Handle Cover Letter File Selection (Optional)
  const handleCoverLetterChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type and size (optional)
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF or DOCX files are allowed for the cover letter.");
        setCoverLetterFile(null);
        return;
      }
      setCoverLetterFile(file);
      setError(null);
    }
  };

  // Handle Form Submission
  const handleApply = async () => {
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resumeUrl = await uploadPdfToCloudinary(resumeFile);
      let coverLetterUrl = undefined;
      if (coverLetterFile)
        coverLetterUrl = await uploadPdfToCloudinary(coverLetterFile);

      await applyJob({
        coverLetterUrl: coverLetterUrl,
        resumeUrl: resumeUrl,
        jobId: jobId,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  // const uploadFile = async (file: File): Promise<string> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       // Mock URL
  //       resolve("https://example.com/uploads/" + file.name);
  //     }, 1000);
  //   });
  // };

  // Reset Form on Modal Close
  const resetForm = () => {
    setResumeFile(null);
    setCoverLetterFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog
      open={applyJobModalIsOpen}
      onOpenChange={(open) => {
        setApplyJobModalIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-gradient-to-r bg-gray-50 text-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Apply for the Job</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your application.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form className="space-y-4">
          {/* Resume Upload */}
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Resume (PDF)
            </label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="resume-upload"
                className="flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <FaUpload className="mr-2" />
                {resumeFile ? "Change Resume" : "Upload Resume"}
                <input
                  id="resume-upload"
                  name="resume-upload"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={handleResumeChange}
                />
              </label>
              {resumeFile && (
                <span className="ml-3 text-sm text-gray-500">
                  {resumeFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Cover Letter Upload */}
          <div>
            <label
              htmlFor="coverLetterFile"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Cover Letter (Optional, PDF or DOCX)
            </label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="cover-letter-upload"
                className="flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <FaUpload className="mr-2" />
                {coverLetterFile
                  ? "Change Cover Letter"
                  : "Upload Cover Letter"}
                <input
                  id="cover-letter-upload"
                  name="cover-letter-upload"
                  type="file"
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={handleCoverLetterChange}
                />
              </label>
              {coverLetterFile && (
                <span className="ml-3 text-sm text-gray-500">
                  {coverLetterFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success Message */}
          {success && (
            <p className="text-green-500 text-sm">
              Application submitted successfully!
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setApplyJobModalIsOpen(false)}
              disabled={loading}
              className="flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleApply}
              disabled={loading || success}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperclip className="mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

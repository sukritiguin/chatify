/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "react-toastify";

// Define option interfaces for select inputs
interface Option {
  value: string;
  label: string;
}

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: any;
}

export const JobPostingModal: React.FC<JobPostingModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Form state management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "temporary"
    | "freelance"
  >("full_time");
  const [salaryMin, setSalaryMin] = useState<number | "">("");
  const [salaryMax, setSalaryMax] = useState<number | "">("");
  const [currency, setCurrency] = useState<Option | null>(null);
  const [skills, setSkills] = useState<MultiValue<Option>>([]);
  const [experienceLevel, setExperienceLevel] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Define options for select inputs
  const employmentTypeOptions: Option[] = [
    { value: "full_time", label: "Full-Time" },
    { value: "part_time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
  ];

  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([]);
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);

  const postJob = useMutation(api.queries.postJob);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://openexchangerates.org/api/currencies.json"
        );
        const options = Object.keys(response.data).map((key) => ({
          value: key,
          label: key,
        }));
        setCurrencyOptions(options);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, [isOpen]);

  const experienceLevelOptions: Option[] = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "lead", label: "Lead" },
    { value: "director", label: "Director" },
    { value: "executive", label: "Executive" },
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("https://api.github.com/languages");
        const options = response.data.map((skill: any) => ({
          value: skill.name,
          label: skill.name,
        }));
        setSkillOptions(options);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [isOpen]);

  // Define the resetForm function
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setEmploymentType("full_time");
    setSalaryMin("");
    setSalaryMax("");
    setCurrency(null);
    setSkills([]);
    setExperienceLevel(null);
    setLoading(false);
  };

  // Handle form submission (placeholder)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !title ||
      !description ||
      !location ||
      !employmentType ||
      !salaryMin ||
      !currency ||
      skills.length === 0 ||
      !experienceLevel
    ) {
      toast.error("Please fill out all required fields.");
      resetForm();
      return;
    }

    if (salaryMax && salaryMax < salaryMin) {
      toast.error("Maximum salary cannot be less than minimum salary.");
      resetForm();
      return;
    }

    setLoading(true);

    const data = {
      title: title,
      description: description,
      location: location,
      employmentType: employmentType as
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "temporary"
        | "freelance",
      salaryRange: {
        min: salaryMin,
        max: salaryMax ? salaryMax : salaryMin,
        currency: currency.value as string,
      },
      skills: skills.map((skill) => skill.value), // List of required skills (can be skill names or IDs)
      experienceLevel: experienceLevel.value as
        | "entry"
        | "mid"
        | "senior"
        | "lead"
        | "director"
        | "executive",
    };

    try {
      await postJob({ data: data });
      setLoading(false);
      toast.success("Job created successfully");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      resetForm();
      onClose(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto bg-gray-50 text-gray-800 rounded-lg shadow-xl p-6">
        <DialogHeader className="flex justify-between items-center mb-4">
          <div>
            <DialogTitle className="text-2xl font-bold">
              Create a New Job Posting
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill out the form below to post a new job listing.
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Job Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the job..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1"
              rows={5}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label
              htmlFor="employmentType"
              className="block text-sm font-medium text-gray-700"
            >
              Employment Type <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              id="employmentType"
              options={employmentTypeOptions}
              value={employmentType}
              onChange={(option: any) =>
                setEmploymentType(
                  (option?.value === undefined ? "full_time" : option.value) as
                    | "full_time"
                    | "part_time"
                    | "contract"
                    | "internship"
                    | "temporary"
                    | "freelance"
                )
              }
              placeholder="Select employment type"
              isClearable
              className="mt-1"
              classNamePrefix="react-select"
            />
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Minimum Salary */}
            <div>
              <label
                htmlFor="salaryMin"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Salary <span className="text-red-500">*</span>
              </label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="e.g., 60000"
                value={salaryMin}
                onChange={(e) =>
                  setSalaryMin(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                required
                className="mt-1"
                min={0}
              />
            </div>

            {/* Maximum Salary */}
            <div>
              <label
                htmlFor="salaryMax"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Salary
              </label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="e.g., 80000"
                value={salaryMax}
                onChange={(e) =>
                  setSalaryMax(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="mt-1"
                min={0}
              />
            </div>

            {/* Currency */}
            <div className="md:col-span-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency <span className="text-red-500">*</span>
              </label>
              <ReactSelect
                id="currency"
                options={currencyOptions}
                value={currency}
                onChange={(option: SingleValue<Option>) => setCurrency(option)}
                placeholder="Select currency"
                isClearable
                className="mt-1"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700"
            >
              Skills <span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              id="skills"
              options={skillOptions}
              isMulti
              isClearable
              value={skills}
              onChange={(option: MultiValue<Option>) => setSkills(option)}
              placeholder="Select or create skills..."
              className="mt-1"
              styles={{
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "#acf88d",
                }),
              }}
              classNamePrefix="react-select"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label
              htmlFor="experienceLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Level <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              id="experienceLevel"
              options={experienceLevelOptions}
              value={experienceLevel}
              onChange={(option: SingleValue<Option>) =>
                setExperienceLevel(option)
              }
              placeholder="Select experience level"
              isClearable
              className="mt-1"
              classNamePrefix="react-select"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full"
            onClick={handleSubmit}
          >
            {"Create Job Posting"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

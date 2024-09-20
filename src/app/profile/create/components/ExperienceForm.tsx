/* eslint-disable @typescript-eslint/no-explicit-any */
// ExperienceForm.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Experience } from "../../../../../types/profile.interface";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Loader from "@/components/ui/Loader";
import Image from "next/image";

const ExperienceForm = ({
  experience,
  index,
  handleExperienceChange,
}: {
  experience: Experience;
  index: number;
  handleExperienceChange: (
    index: number,
    field: keyof Experience,
    value: string
  ) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const organizations = useQuery(api.queries.getAllOrganizations);

  if (organizations === undefined) return <Loader />;

  const filteredOrganizations = organizations.filter((organization) =>
    organization.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* <Input
        className="my-1"
        placeholder="Company"
        value={experience.company}
        onChange={(e) =>
          handleExperienceChange(index, "company", e.target.value)
        }
        disabled={true}
      /> */}

      {/* Add experience list down for company */}

      <Select
        onValueChange={(value) =>
          handleExperienceChange(index, "company", value)
        } // Store the selected organization ID
        value={experience.company}
      >
        <SelectTrigger className="w-full h-16">
          <SelectValue placeholder="Select an Organization" />
        </SelectTrigger>
        <SelectContent>
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Display filtered organizations */}
          {filteredOrganizations.map((organization) => (
            <SelectItem
              key={organization._id}
              value={organization._id}
              className="h-16 flex items-center space-x-2"
            >
              {organization.logo ? (
                <Image
                  src={organization.logo}
                  alt={`${organization.name} logo`}
                  className="w-8 h-8 rounded-full" // Adjust size as needed
                  width={36}
                  height={36}
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full text-white font-bold">
                  {organization.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-650 font-semibold">{organization.name}</span>
            </SelectItem>
          ))}

          {/* Show a message if no organizations are found */}
          {filteredOrganizations.length === 0 && (
            <div className="p-2 text-gray-500">No organizations found.</div>
          )}
        </SelectContent>
      </Select>

      {/* Display selected organization */}
      {/* {selectedOrganization && (
        <div className="mt-4">
          <p>Selected Organization: {organizations.find(org => org.id === selectedOrganization)?.name}</p>
        </div>
      )} */}

      <Input
        className="my-1"
        placeholder="Designation"
        value={experience.designation}
        onChange={(e) =>
          handleExperienceChange(index, "designation", e.target.value)
        }
      />
      <Select
        onValueChange={(value) => {
          handleExperienceChange(index, "type", value);
        }}
        value={experience.type}
      >
        <SelectTrigger className="w-full my-1">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fulltime">Full Time</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
          <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
          <SelectItem value="parttime">Part Time</SelectItem>
          <SelectItem value="WFH">WFH</SelectItem>
          <SelectItem value="freelance">Freelance</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex space-x-2">
        <Input
          className="my-1"
          placeholder="Start Date"
          type="date"
          value={experience.start}
          onChange={(e) =>
            handleExperienceChange(index, "start", e.target.value)
          }
        />
        <Input
          className="my-1"
          placeholder="End Date"
          type="date"
          value={experience.end}
          onChange={(e) => handleExperienceChange(index, "end", e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExperienceForm;

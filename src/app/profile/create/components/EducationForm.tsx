/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Education } from "../../../../../types/profile.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const EducationForm = ({
  education,
  index,
  handleEducationChange,
}: {
  education: Education;
  index: number;
  handleEducationChange: (
    index: number,
    field: keyof Education,
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
    <div className="space-y-4">
      {/* Institute */}
      {/* <Input
        className="my-1"
        placeholder="Institute"
        value={education.institute}
        onChange={(e) =>
          handleEducationChange(index, "institute", e.target.value)
        }
        disabled
      /> */}

      <Select
        onValueChange={(value) =>
          handleEducationChange(index, "institute", value)
        } // Store the selected organization ID
        value={education.institute}
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
              <span className="text-gray-650 font-semibold">
                {organization.name}
              </span>
            </SelectItem>
          ))}

          {/* Show a message if no organizations are found */}
          {filteredOrganizations.length === 0 && (
            <div className="p-2 text-gray-500">No organizations found.</div>
          )}
        </SelectContent>
      </Select>

      {/* Course */}
      <Input
        className="my-1"
        placeholder="Course"
        value={education.course}
        onChange={(e) => handleEducationChange(index, "course", e.target.value)}
      />

      {/* Start Date & End Date */}
      <div className="flex space-x-2">
        <Input
          className="my-1"
          placeholder="Start Date"
          type="date"
          value={education.start}
          onChange={(e) =>
            handleEducationChange(index, "start", e.target.value)
          }
        />
        <Input
          className="my-1"
          placeholder="End Date"
          type="date"
          value={education.end}
          onChange={(e) => handleEducationChange(index, "end", e.target.value)}
        />
      </div>

      {/* Optional Story */}
      <Input
        className="my-1"
        placeholder="Story (optional)"
        value={education.story}
        onChange={(e) => handleEducationChange(index, "story", e.target.value)}
      />
    </div>
  );
};

export default EducationForm;

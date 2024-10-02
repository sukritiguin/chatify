/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SearchFilter.tsx
import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import SearchableDropdown from "./SearchableDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Job } from "../../../../types/job.interface";

interface SearchFilterProps {
  jobs: Job[] | undefined;
  setJobs: React.Dispatch<React.SetStateAction<Job[] | undefined>>;
}

export const SearchFilter = ({ jobs, setJobs }: SearchFilterProps) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("All");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);

  const locationsAndSkills = useQuery(
    api.queries.getAllLocationsAndSkillsFromJobs
  );

  const mappedUserIdandOrganization = useQuery(
    api.queries.mapUserIdWithOrganizationsForJobs
  );

  useEffect(() => {
    console.log(selectedLocations);
  }, [selectedLocations]);

  const allListedJobs = useQuery(api.queries.getAllActiveJobs);

  // Extract unique locations and skills using Set
  const allLocations = Array.from(new Set(locationsAndSkills?.locations || []));
  const allSkills = Array.from(new Set(locationsAndSkills?.skills || []));

  // Employment Type Options
  const employmentTypes = [
    "All",
    "Full Time",
    "Part Time",
    "Contract",
    "Internship",
    "Temporary",
    "Freelance",
  ];

  // Experience Level Options
  const experienceLevels = [
    "All",
    "Entry",
    "Mid",
    "Senior",
    "Lead",
    "Director",
    "Executive",
  ];

  // Handler functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log(e.target.value, searchTerm);
  };

  const handleEmploymentTypeChange = (type: string) => setEmploymentType(type);

  const handleExperienceLevelChange = (level: string) =>
    setExperienceLevel(level);

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const clearFilters = () => {
    setEmploymentType("All");
    setExperienceLevel("All");
    setSelectedLocations([]);
    setSelectedSkills([]);
  };

  useEffect(() => {
    if (jobs !== undefined && allListedJobs) {
      const filteredJobs = allListedJobs.filter((job) => {
        const matchesSearchTerm =
          searchTerm === "" ||
          job.title
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          job.description
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          (mappedUserIdandOrganization[job.userId] &&
            mappedUserIdandOrganization[job.userId]
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase()));

        const matchesLocation =
          selectedLocations.length === 0 ||
          selectedLocations.includes(job.location);

        const matchesSkill =
          selectedSkills.length === 0 ||
          selectedSkills.some((skill) => job.skills.includes(skill));

        const matchesEmploymentType =
          employmentType === "All" ||
          employmentType.toLocaleLowerCase().replace(" ", "_") ===
            job.employmentType;

        const matchesExperienceLevel =
          experienceLevel === "All" ||
          experienceLevel.toLocaleLowerCase().replace(" ", "_") ===
            job.experienceLevel;

        return (
          matchesSearchTerm &&
          matchesLocation &&
          matchesSkill &&
          matchesEmploymentType &&
          matchesExperienceLevel
        );
      });

      setJobs(filteredJobs);
    }
  }, [
    searchTerm,
    allListedJobs,
    selectedLocations,
    selectedSkills,
    employmentType,
    experienceLevel,
  ]);

  return (
    <div className="flex flex-col space-y-2 my-2 w-full mx-auto mt-0">
      {/* Search Input */}
      <div className="relative flex">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for jobs..."
          className="w-full pl-12 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <FaFilter
          className="mt-2 ml-4 mr-0 text-2xl hover:cursor-pointer text-blue-500"
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
        />
      </div>

      {/* Filters Section */}
      {isFilterDropdownOpen && (
        <div className="flex flex-wrap gap-4">
          {/* Employment Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                <FaFilter className="mr-2" /> Employment Type: {employmentType}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-md">
              {employmentTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleEmploymentTypeChange(type)}
                  className={`cursor-pointer ${
                    employmentType === type ? "bg-blue-100" : ""
                  }`}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Experience Level Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                <FaFilter className="mr-2" /> Experience: {experienceLevel}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-white border border-gray-200 rounded-lg shadow-md">
              {experienceLevels.map((level) => (
                <DropdownMenuItem
                  key={level}
                  onClick={() => handleExperienceLevelChange(level)}
                  className={`cursor-pointer ${
                    experienceLevel === level ? "bg-green-100" : ""
                  }`}
                >
                  {level}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Filter */}
          <SearchableDropdown
            label="Locations"
            options={allLocations || []}
            selectedOptions={selectedLocations}
            toggleOption={toggleLocation}
            buttonColor="bg-purple-500"
          />

          {/* Skills Filter */}

          <SearchableDropdown
            label="Skills"
            options={allSkills || []}
            selectedOptions={selectedSkills}
            toggleOption={toggleSkill}
            buttonColor="bg-yellow-500"
          />
        </div>
      )}

      {/* Selected Filters Display */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Employment Type */}
        {employmentType !== "All" && (
          <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Employment: {employmentType}
            <FaTimes
              className="ml-2 cursor-pointer"
              onClick={() => setEmploymentType("All")}
            />
          </span>
        )}

        {/* Experience Level */}
        {experienceLevel !== "All" && (
          <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Experience: {experienceLevel}
            <FaTimes
              className="ml-2 cursor-pointer"
              onClick={() => setExperienceLevel("All")}
            />
          </span>
        )}

        {/* Locations */}
        {selectedLocations.map((location) => (
          <span
            key={location}
            className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
          >
            {location}
            <FaTimes
              className="ml-2 cursor-pointer"
              onClick={() => toggleLocation(location)}
            />
          </span>
        ))}

        {/* Skills */}
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <FaTimes
              className="ml-2 cursor-pointer"
              onClick={() => toggleSkill(skill)}
            />
          </span>
        ))}

        {/* Clear All Filters Button */}
        {(employmentType !== "All" ||
          experienceLevel !== "All" ||
          selectedLocations.length > 0 ||
          selectedSkills.length > 0) && (
          <button
            onClick={clearFilters}
            className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 focus:outline-none"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;

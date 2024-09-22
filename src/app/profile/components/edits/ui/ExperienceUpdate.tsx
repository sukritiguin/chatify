/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { Experience } from "../../../../../../types/profile.interface";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export function ExperienceUpdate({
  isOpen,
  setIsOpen,
  experienceIndex,
  experience,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  experienceIndex: number;
  experience: Experience;
}) {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<string>(experience.company);
  const [designation, setDesignation] = useState<string>(
    experience.designation
  );
  const [startdate, setStartDate] = useState<string>(experience.start);
  const [enddate, setEndDate] = useState<string>(experience.end || "");
  const [type, setType] = useState<
    | ""
    | "fulltime"
    | "internship"
    | "apprenticeship"
    | "parttime"
    | "WFH"
    | "freelance"
  >(experience.type || "");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const organizations = useQuery(api.queries.getAllOrganizations);

  const filteredOrganizations = organizations?.filter((organization) =>
    organization.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateExperience = useMutation(api.queries.updateExperience);

  if (organizations === undefined) return <Loader />;

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      type: type,
      company: company,
      designation: designation,
      start: startdate,
      end: enddate,
    };
    updateExperience({
      experienceIndex: experienceIndex,
      experienceData: data,
    });
    setIsOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {loading && <Loader />}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company Name
            </Label>
            {/* <Input
              id="company"
              defaultValue={company}
              className="col-span-3"
              onChange={(event) => setCompany(event.target.value)}
              disabled
            /> */}
          </div>
          <div className="grid items-center gap-4 ml-4">
            <Select
              onValueChange={(value) => setCompany(value)} // Store the selected organization ID
              value={company}
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
                {filteredOrganizations?.map((organization) => (
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
                {filteredOrganizations?.length === 0 && (
                  <div className="p-2 text-gray-500">
                    No organizations found.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designation" className="text-right">
              Designation
            </Label>
            <Input
              id="designation"
              defaultValue={designation}
              className="col-span-3"
              onChange={(event) => {
                setDesignation(event.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">
              Start Date
            </Label>
            <Input
              id="start"
              defaultValue={startdate}
              className="col-span-3"
              type="date"
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">
              End Date
            </Label>
            <Input
              id="end"
              defaultValue={enddate}
              className="col-span-3"
              type="date"
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(
                  value as
                    | ""
                    | "fulltime"
                    | "internship"
                    | "apprenticeship"
                    | "parttime"
                    | "WFH"
                    | "freelance"
                );
              }}
              defaultValue={type}
            >
              <SelectTrigger id="type" style={{ width: "180px" }}>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="WFH">Work From Home</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

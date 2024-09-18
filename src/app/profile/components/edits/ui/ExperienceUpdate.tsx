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
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Loader from "@/components/ui/Loader";

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

  const updateExperience = useMutation(api.queries.updateExperience);

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
            <Input
              id="company"
              defaultValue={company}
              className="col-span-3"
              onChange={(event) => {
                setCompany(event.target.value);
              }}
            />
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <select
              id="type"
              className="col-span-3"
              value={type}
              onChange={(event) => {
                setType(event.target.value as any); // Cast to any or a valid union type
              }}
            >
              <option value="">Select Type</option>
              <option value="fulltime">Full Time</option>
              <option value="internship">Internship</option>
              <option value="apprenticeship">Apprenticeship</option>
              <option value="parttime">Part Time</option>
              <option value="WFH">Work From Home</option>
              <option value="freelance">Freelance</option>
            </select>
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

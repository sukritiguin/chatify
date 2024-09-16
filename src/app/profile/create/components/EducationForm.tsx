/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";
import { Education } from "../../../../../types/profile.interface";

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
  return (
    <div className="space-y-4">
      {/* Institute */}
      <Input
        className="my-1"
        placeholder="Institute"
        value={education.institute}
        onChange={(e) =>
          handleEducationChange(index, "institute", e.target.value)
        }
      />

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

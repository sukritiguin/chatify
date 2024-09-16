/* eslint-disable @typescript-eslint/no-explicit-any */
// ExperienceForm.tsx
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
const ExperienceForm = ({ experience, index, handleExperienceChange }: { experience: any, index: any, handleExperienceChange: any }) => {
  return (
    <div>
      <Input
        className="my-1"
        placeholder="Company"
        value={experience.company}
        onChange={(e) =>
          handleExperienceChange(index, 'company', e.target.value)
        }
      />
      <Input
        className="my-1"
        placeholder="Designation"
        value={experience.designation}
        onChange={(e) =>
          handleExperienceChange(index, 'designation', e.target.value)
        }
      />
      <Select
        onValueChange={(value) => {
          handleExperienceChange(index, 'type', value);
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
          <SelectItem value="part time">Part Time</SelectItem>
          <SelectItem value="WFH">Work From Home (WFH)</SelectItem>
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
            handleExperienceChange(index, 'start', e.target.value)
          }
        />
        <Input
          className="my-1"
          placeholder="End Date"
          type="date"
          value={experience.end}
          onChange={(e) =>
            handleExperienceChange(index, 'end', e.target.value)
          }
        />
      </div>
    </div>
  );
};

export default ExperienceForm;

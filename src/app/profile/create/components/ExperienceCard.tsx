/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import React from 'react';
import { FaTrash, FaCalendarAlt, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { Experience } from '../../../../../types/profile.interface';

const ExperienceCard = ({ experience, index, removeExperience }: { experience: Experience, index: number, removeExperience: (index: number) => void }) => {
  return (
    <Card className="mb-6 p-6 shadow-lg rounded-lg bg-gradient-to-r from-blue-100 to-blue-300 hover:shadow-2xl transition-shadow duration-200 ease-in-out">
      <CardContent className="flex flex-col space-y-4">
        {/* Company Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBuilding className="text-gray-600 text-2xl" />
            <CardTitle className="text-xl font-semibold text-gray-900">{experience.company}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50"
            onClick={() => removeExperience(index)}
          >
            <FaTrash className="mr-1" /> Remove
          </Button>
        </div>

        {/* Designation */}
        <div className="flex items-center space-x-3 text-lg text-gray-700">
          <FaBriefcase className="text-gray-500 text-lg" />
          <CardDescription className="font-medium">{experience.designation}</CardDescription>
        </div>

        {/* Dates */}
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <span>{experience.start}</span>
          </div>
          <span className="text-gray-400">—</span>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <span>{experience.end}</span>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="font-medium">{experience.type}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;

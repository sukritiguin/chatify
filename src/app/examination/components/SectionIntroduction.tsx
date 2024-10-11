// SectionIntroductionPage.jsx
"use client";
import React from "react";
import { FaClock, FaExclamationCircle } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SectionIntroductionPage = ({ section }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {section.title}
          </CardTitle>
          {section.isMandatory && (
            <div className="flex items-center justify-center mt-2">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <span className="text-red-500 font-semibold">
                Mandatory Section
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Instructions */}
          <div className="flex items-start space-x-3">
            <AiOutlineFileText className="text-xl text-gray-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Instructions</h3>
              <p className="text-gray-600">
                {section.instructions ||
                  "No specific instructions provided for this section."}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-3">
            <FaClock className="text-xl text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold">Duration</h3>
              <p className="text-gray-600">
                {section.duration
                  ? `${section.duration} minutes`
                  : "No specific duration."}
              </p>
            </div>
          </div>

          {/* Additional Information (Optional) */}
          {/* You can add more sections here if needed, such as section order or other details */}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {}}
            >
              Start Section
            </Button>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => {}}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectionIntroductionPage;

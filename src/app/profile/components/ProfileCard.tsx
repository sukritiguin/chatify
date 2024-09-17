import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Profile } from "../../../../types/profile.interface";

const ProfileCard = ({ profileData }: { profileData: Profile}) => {
  return (
    <Card className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
      <div className="relative">
        <Image
          src={profileData?.coverPhoto as string}
          alt="Cover Photo"
          width={500}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
          <Image
            src={profileData?.profilePhoto as string}
            alt="Profile Photo"
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>
      <CardHeader className="p-4 text-center">
        <CardTitle className="mt-4 text-xl font-semibold text-gray-800">
          {profileData?.bio}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Education Section */}
        <h3 className="text-lg font-semibold text-gray-700">Education</h3>
        <ul className="mt-2 space-y-2">
          {profileData?.educations && profileData.educations.length > 0 ? (
            profileData.educations.map((edu, index) => (
              <li key={index} className="flex flex-col">
                <span className="font-medium text-gray-800">{edu.course}</span>
                <span className="text-gray-500">
                  {edu.institute} ({edu.start} - {edu.end})
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No education details available.</p>
          )}
        </ul>

        {/* Experience Section */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Experience</h3>
        <ul className="mt-2 space-y-2">
          {profileData?.experiences && profileData.experiences.length > 0 ? (
            profileData.experiences.map((exp, index) => (
              <li key={index} className="flex flex-col">
                <span className="font-medium text-gray-800">{exp.designation}</span>
                <span className="text-gray-500">
                  {exp.company} ({exp.start} - {exp.end})
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No experience details available.</p>
          )}
        </ul>

        {/* Skills Section */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Skills</h3>
        <ul className="mt-2 space-y-2">
          {profileData?.skills && profileData.skills.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <li key={index} className="flex flex-col">
                <span className="font-medium text-gray-800">{skill.skill}</span>
                <span className="text-gray-500">
                  Level: {skill.level || "Not specified"}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No skills available.</p>
          )}
        </ul>

        {/* Socials Section */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Socials</h3>
        <div className="flex justify-center space-x-4 mt-2">
          {profileData?.socials && profileData?.socials.linkedIn && (
            <a
              href={profileData.socials.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
          {profileData?.socials && profileData?.socials.github && (
            <a
              href={profileData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline"
            >
              GitHub
            </a>
          )}
          {profileData?.socials && profileData?.socials.twitter && (
            <a
              href={profileData.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
          )}
          {/* {Object.values(profileData?.socials).every((url) => !url) && (
            <p className="text-gray-500">No social links available.</p>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

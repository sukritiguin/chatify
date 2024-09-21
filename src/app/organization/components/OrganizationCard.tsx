/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaGlobe, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import FollowAndFollowing from "../[organizationId]/components/followAndFollowing";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface OrganizationCardProps {
  organization: any;
  myOrganization: boolean;
}

const OrganizationCard = ({
  organization,
  myOrganization
}: OrganizationCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);


  const onHandleClickFollowing = () => {
    if (isFollowing === true) {
      setIsFollowing(false);
    } else {
      setIsFollowing(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Banner with 4:1 aspect ratio */}
      <div className="relative">
        {organization.banner && (
          <Image
            src={organization.banner}
            alt="Organization Banner"
            className="w-full h-40 object-cover" // Set height to 10rem for a 4:1 aspect ratio with width
            height={160} // Height for 4:1 aspect ratio (width: 640px, height: 160px)
            width={640} // Set width for banner image
          />
        )}
        {/* Logo overlapping the banner */}
        {organization.logo && (
          <Image
            src={organization.logo}
            alt={`${organization.name} logo`}
            className="absolute left-4 top-24 h-24 w-24 border-4 border-white rounded-full shadow-lg"
            width={96} // Adjust logo width
            height={96} // Adjust logo height
          />
        )}
      </div>
      <div className="p-6 pt-32">
        {" "}
        {/* Padding top to prevent content overlap with logo */}
        <h2 className="text-2xl font-semibold text-gray-800">
          <div className="flex items-center">
            {organization.name}{" "}
            {!myOrganization && (
              <div onClick={onHandleClickFollowing}>
                <FollowAndFollowing isFollowing={isFollowing} />
              </div>
            )}
          </div>
        </h2>
        <p className="text-gray-600">
          {organization.description || "No description available."}
        </p>
        <div className="mt-4 space-y-2">
          {organization.website && (
            <div className="flex items-center text-gray-600">
              <FaGlobe className="mr-2" />
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {organization.website}
              </a>
            </div>
          )}
          {organization.address && (
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{organization.address}</span>
            </div>
          )}
          {organization.established && (
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2" />
              <span>Established: {organization.established}</span>
            </div>
          )}
          {organization.industry && (
            <div className="mt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                {organization.industry}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;

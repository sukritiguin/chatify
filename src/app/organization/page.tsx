"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import OrganizationCard from "./components/OrganizationCard";
import Loader from "@/components/ui/Loader";
const OrganizationPage = () => {
  const yourOrganization = useQuery(api.queries.getOrganization);

  const data = {
    name: yourOrganization?.name, // Organization name (required)
    description: yourOrganization?.description, // Optional description of the organization
    website: yourOrganization?.website, // Optional website URL
    logo: yourOrganization?.logo, // Optional logo of the organization
    banner: yourOrganization?.banner, // Optional cover photo for the organization
    address: yourOrganization?.address, // Optional address of the organization
    industry: yourOrganization?.industry, // Optional industry the organization belongs to
    established: yourOrganization?.established, // Optional year of establishment
  };

  if (yourOrganization === undefined) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex justify-between overflow-hidden">
        {/* Left Side: Organization Card */}
        <div className="w-3/5 p-4">
          <OrganizationCard organization={data} />
        </div>
        
        {/* Right Side: Related Organizations Section */}
        <div className="w-2/5 pl-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Related Organizations</h2>
          <div className="bg-gray-50 border border-gray-200 shadow-md rounded-lg p-4">
            {/* Replace the following with actual related organization data */}
            <p className="text-gray-600">No related organizations available.</p>
            {/* Example of how to show related organizations */}
            {/* 
            <RelatedOrganizationCard organization={relatedOrg1} />
            <RelatedOrganizationCard organization={relatedOrg2} />
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;

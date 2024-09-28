"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import OrganizationCard from "../components/OrganizationCard";
import { Id } from "../../../../convex/_generated/dataModel";

const OrganizationIdPage = ({
  params,
}: {
  params: { organizationId: string };
}) => {
  const organization = useQuery(api.queries.getOrganizationByUserId, {
    userId: params.organizationId as Id<"users">
  });

  const data = {
    name: organization?.name, // Organization name (required)
    description: organization?.description, // Optional description of the organization
    website: organization?.website, // Optional website URL
    logo: organization?.logo, // Optional logo of the organization
    banner: organization?.banner, // Optional cover photo for the organization
    address: organization?.address, // Optional address of the organization
    industry: organization?.industry, // Optional industry the organization belongs to
    established: organization?.established, // Optional year of establishment
  };

  return (
    <OrganizationCard
      organization={data}
      myOrganization={false}
    />
  );
};

export default OrganizationIdPage;

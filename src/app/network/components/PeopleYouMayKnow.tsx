/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PeopleCard } from "./PeopleCard";

interface PeopleInterface {
  userId: Id<"users">;
  cover: string | undefined;
  avatar: string | undefined;
  name: string | undefined;
  bio: string | undefined;
}

interface PropsInterface {
  organizationId: Id<"organizations">;
  suggestedPeople: PeopleInterface[];
}

export const PeopleYouMayKnow = ({
  organizationId,
  suggestedPeople,
}: PropsInterface) => {
  const organization = useQuery(api.queries.getOrganizationById, {
    organizationId: organizationId,
  });

  const allConnectionRequests = useQuery(api.queries.getAllConnectionRequests);

  const allConnectionRequestsSender = allConnectionRequests?.map(
    (request) => request.sender
  );

  return (
    <Card className="p-6 shadow-md my-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          People You May Know from{" "}
          <span className="text-blue-700">{organization?.name}</span>
        </h2>
      </div>
      {suggestedPeople && suggestedPeople.length === 0 ? (
        <p className="text-gray-500">No suggestions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedPeople &&
            suggestedPeople.map((people: PeopleInterface) => {
              const isConnectionRequestSent =
                allConnectionRequestsSender?.includes(people.userId);

              return (
                !isConnectionRequestSent && (
                  <PeopleCard key={people.userId} people={people} />
                )
              );
            })}
        </div>
      )}
    </Card>
  );
};

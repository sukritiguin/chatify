// src/components/NetworkPage.jsx
"use client";

import React from "react";
import { PeopleYouMayKnow } from "./components/PeopleYouMayKnow";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ConnectionRequestSection } from "./components/ConnectionRequestSection";


const NetworkPage = () => {

  const allSuggestedPeople = useQuery(api.queries.getPeopleYouMayKnow);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Network</h1>

      {/* Connection Requests Section */}
      <ConnectionRequestSection />

      {allSuggestedPeople &&
        Object.entries(allSuggestedPeople).map(([key, value]) => (
          <PeopleYouMayKnow
            key={key}
            organizationId={key as Id<"organizations">}
            suggestedPeople={
              value as {
                userId: Id<"users">;
                cover: string | undefined;
                avatar: string | undefined;
                name: string | undefined;
                bio: string | undefined;
              }[]
            }
          />
        ))}
    </div>
  );
};

export default NetworkPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiUserPlus } from "react-icons/fi";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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

  const handleConnect = () => {
    console.log("connect");
  };

  return (
    <Card className="p-6 shadow-md my-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">People You May Know from <span className="text-blue-700">{organization?.name}</span></h2>
      </div>
      {suggestedPeople && suggestedPeople.length === 0 ? (
        <p className="text-gray-500">No suggestions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedPeople &&
            suggestedPeople.map((people: PeopleInterface) => (
              <Card
                key={people.userId}
                className="p-4 shadow-sm flex flex-col relative"
              >
                {/* Cover Photo */}
                <div
                  className="w-full h-32 bg-cover bg-center rounded-t-md"
                  style={{ backgroundImage: `url(${people.cover})` }}
                >
                  {/* Empty div for cover photo */}
                </div>

                {/* Profile Avatar */}
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
                  <Avatar className="border-4 border-white min-h-28 min-w-28">
                    <AvatarImage src={people.avatar} alt={people.name} />
                    <AvatarFallback>{people.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Content Below Avatar */}
                <div className="mt-16 text-center">
                  <p className="font-medium text-lg">{people.name}</p>
                  <p className="text-sm text-gray-500">{people.bio}</p>
                </div>

                {/* Mutual Connections */}
                <div className="mt-4 flex items-center justify-center space-x-2">
                  {/* Example mutual connection avatar */}
                  <Avatar>
                    <AvatarImage
                      src="https://i.pravatar.cc/150?img=6"
                      alt="Damini"
                    />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-500">
                    Damini and {0} other mutual connection
                    {2 > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Connect Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect()}
                  aria-label={`Connect with ${people.name}`}
                  className="mt-4 flex items-center justify-center mx-auto"
                >
                  <FiUserPlus className="mr-2" />
                  Connect
                </Button>
              </Card>
            ))}
        </div>
      )}
    </Card>
  );
};

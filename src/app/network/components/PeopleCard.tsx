import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiUserCheck, FiUserPlus } from "react-icons/fi";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";

interface PeopleInterface {
  userId: Id<"users">;
  cover: string | undefined;
  avatar: string | undefined;
  name: string | undefined;
  bio: string | undefined;
}

export const PeopleCard = ({ people }: { people: PeopleInterface }) => {
  const [connectionRequestIcon, setConnectionRequestIcon] = useState<
    "before" | "after"
  >("before");

  const sendConnectionRequest = useMutation(api.queries.sendConnectRequest);
  const connectionRequestStatus = useQuery(
    api.queries.getStatusOfConnectionRequest,
    {
      connectionRequestReceiverUserId: people.userId,
    }
  );

  const handleConnect = async () => {
    await sendConnectionRequest({
      connectionRequestReceiverUserId: people.userId,
    });
    setConnectionRequestIcon("after");
  };

  if (connectionRequestStatus?.status === "accepted") {
    return <></>;
  }

  return (
    <Card key={people.userId} className="p-4 shadow-sm flex flex-col relative">
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
        <p className="text-sm text-gray-500">
          {people.bio && people.bio.length > 25
            ? `${people.bio.slice(0, 25)}...`
            : people.bio}
        </p>
      </div>

      {/* Mutual Connections */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        {/* Example mutual connection avatar */}
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=6" alt="Damini" />
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
        className={`mt-4 flex items-center justify-center mx-auto ${
          (connectionRequestIcon === "after" ||
            connectionRequestStatus?.status === "pending") &&
          "text-green-700"
        }`}
        disabled={
          connectionRequestIcon === "after" ||
          connectionRequestStatus?.status === "pending"
        }
      >
        {connectionRequestIcon === "after" ||
        connectionRequestStatus?.status === "pending" ? (
          <FiUserCheck className="mr-2" />
        ) : (
          <FiUserPlus className="mr-2" />
        )}
        {connectionRequestIcon === "after" ||
        connectionRequestStatus?.status === "pending"
          ? "Pending"
          : "Connect"}
      </Button>
    </Card>
  );
};

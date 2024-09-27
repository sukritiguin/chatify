"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface ConnectionRequestInterface {
  connectionId: Id<"connection">;
  sender: string;
  receiver: string;
}

export const ConnectionRequest = ({
  connectionRequest,
}: {
  connectionRequest: ConnectionRequestInterface;
}) => {
  const [connectionRequestAccept, setConnectionRequestAccept] =
    useState<boolean>();

  const senderProfile = useQuery(api.queries.getUserProfileById, {
    userId: connectionRequest.sender as Id<"users">,
  });

  const acceptOrRejectConnectionRequest = useMutation(
    api.queries.acceptOrRejectConnectionRequest
  );

  const handleDecline = async () => {
    await acceptOrRejectConnectionRequest({
      connectionId: connectionRequest.connectionId,
      status: "rejected",
    });
    setConnectionRequestAccept(false);
    console.log("Connection declined");
  };

  const handleAccept = async () => {
    await acceptOrRejectConnectionRequest({
      connectionId: connectionRequest.connectionId,
      status: "accepted",
    });
    setConnectionRequestAccept(true);
    console.log("Connection accepted");
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={senderProfile?.profilePhoto} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="font-medium">{senderProfile?.name}</p>
          <p className="text-sm text-gray-500">
            {senderProfile && senderProfile.bio && senderProfile.bio.length > 50
              ? `${senderProfile.bio.slice(0, 50)}...`
              : senderProfile?.bio}
          </p>
          <p className="text-sm text-gray-500">
            {10} mutual connection
            {10 > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          className="text-green-700 hover:text-green-800"
          variant="outline"
          size="sm"
          onClick={() => handleAccept()}
          aria-label={`Accept connection request from ${senderProfile?.name}`}
        >
          <FiUserCheck className="mr-2" />
          Accept
        </Button>
        <Button
          className="text-red-600 hover:text-red-700"
          variant="outline"
          size="sm"
          onClick={() => handleDecline()}
          aria-label={`Decline connection request from ${senderProfile?.name}`}
        >
          <FiUserX className="mr-2" />
          Decline
        </Button>
      </div>
    </div>
  );
};

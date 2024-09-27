import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { FiSearch, } from "react-icons/fi";
import { api } from "../../../../convex/_generated/api";
import { ConnectionRequest } from "./ConnectionRequest";

export const ConnectionRequestSection = () => {
  const allConnectionRequests = useQuery(api.queries.getAllConnectionRequests);

  return (
    <Card className="p-6 mb-8 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Connection Requests</h2>
        <Button variant="ghost" size="icon" aria-label="Search">
          <FiSearch size={20} />
        </Button>
      </div>
      {allConnectionRequests && allConnectionRequests.length === 0 ? (
        <p className="text-gray-500">You have no new connection requests.</p>
      ) : (
        allConnectionRequests &&
        allConnectionRequests.map((request) => (
          <ConnectionRequest
            key={request._id}
            connectionRequest={{
              connectionId: request._id,
              sender: request.sender,
              receiver: request.receiver,
            }}
          />
        ))
      )}
    </Card>
  );
};

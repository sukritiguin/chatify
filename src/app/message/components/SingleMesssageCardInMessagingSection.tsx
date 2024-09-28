import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiMessageSquare } from "react-icons/fi";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";

interface ParticipantInterface {
  conversationId: Id<"conversation">;
  avatar: string;
  name: string;
  unseenMessageCount: number;
  lastUnseenMessage: string;
  userId: Id<"users">;
}

export const SingleMessageCardInMessagingSection = ({
  participant,
}: {
  participant: ParticipantInterface;
}) => {
  return (
    <Card className="flex items-center justify-between p-4 hover:shadow-md transition duration-300 ease-in-out">
      {/* Left Side: Avatar and Conversation Info */}
      <div className="flex items-center space-x-3">
        <Avatar className="mr-4">
          <AvatarImage src={participant.avatar} alt={participant.name} />
          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/profile/${participant.userId}`}>
            <span className="font-semibold text-gray-700 hover:underline">
              {participant.name}
            </span>
          </Link>

          <span className="text-sm text-gray-500">
            {participant.lastUnseenMessage || "No new messages"}
          </span>
        </div>
      </div>

      {/* Right Side: Unseen Messages Badge and Message Button */}
      <div className="flex items-center space-x-3">
        {participant.unseenMessageCount > 0 && (
          <div className="relative">
            <span className="absolute -top-3 mr-2 -right-2 bg-green-600 text-white text-xs font-semibold rounded-full px-2 py-1">
              {participant.unseenMessageCount}
            </span>
          </div>
        )}
        <Link href={`/message/${participant.conversationId}`}>
          <Button
            variant="outline"
            size="sm"
            aria-label={`Message ${participant.name}`}
            className="ml-3 text-gray-600 hover:text-gray-800"
          >
            <FiMessageSquare />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

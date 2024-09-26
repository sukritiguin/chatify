import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertToTime } from "./ReceivedMessage";

export const SentMessage = ({
  content,
  messageUserId,
  createdAt,
  receiverId,
  messageId,
}: {
  content: string;
  messageUserId: Id<"users">;
  createdAt: string;
  receiverId: Id<"users">;
  messageId: Id<"messages">;
}) => {
  const image = "";

  let userInfo: {
    name: string;
    avatar: string;
  } = { name: "", avatar: "" };

  const userRegistedAs = useQuery(api.queries.getUserRegistration);

  const isMessageRead = useQuery(api.queries.isMessageRead, {
    messageId: messageId,
    userId: receiverId,
  });

  if (userRegistedAs?.type == "profile") {
    const profile = useQuery(api.queries.getUserProfileById, {
      userId: messageUserId,
    });

    userInfo = {
      name: profile?.name as string,
      avatar: profile?.profilePhoto as string,
    };
  } else {
    const organization = useQuery(api.queries.getOrganizationByUserId, {
      userId: messageUserId as Id<"users">,
    });

    userInfo = {
      name: organization?.name as string,
      avatar: organization?.logo as string,
    };
  }

  return (
    <div className="flex items-start space-x-2 justify-end">
      <div className="flex flex-col bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-800">
        <span className="font-semibold">{userInfo.name}</span>
        <span>{content}</span>
        {image && <Image src="" height={200} width={200} alt="message" />}
        <div className="flex ml-auto">
          <span className="text-end text-gray-700 mb-0 text-xs">
            {convertToTime(createdAt)}
          </span>
          <span
            className={`text-end ${!isMessageRead ? "text-green-700" : "text-blue-700"} ml-1 text-sm`}
          >
            <IoIosCheckmarkCircle className="" />
          </span>
        </div>
      </div>

      {userInfo.avatar ? (
        <Avatar className="w-6 h-6">
          <AvatarImage src={userInfo.avatar} alt="@shadcn" />
          <AvatarFallback>{"S"}</AvatarFallback>
        </Avatar>
      ) : (
        <FaUserCircle className="text-gray-500 w-6 h-6" />
      )}
    </div>
  );
};

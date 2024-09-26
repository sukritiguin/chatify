import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { IoBanOutline } from "react-icons/io5";

export const convertToTime = (dateString: string): string => {
  const date = new Date(dateString); // Convert string to Date object

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // If hour is 0, set to 12 (midnight)
  const minutesString =
    minutes < 10 ? "0" + minutes.toString() : minutes.toString(); // Add leading 0 to minutes

  const timeString = hours + ":" + minutesString + " " + ampm;

  return timeString;
};

export const ReceivedMessage = ({
  message,
  content,
  messageUserId,
  messageId,
  createdAt,
}: {
  message: any;
  content: string;
  messageUserId: Id<"users">;
  messageId: Id<"messages">;
  createdAt: string;
}) => {
  const image = "";

  let userInfo: {
    name: string;
    avatar: string;
  } = { name: "", avatar: "" };

  const userRegistedAs = useQuery(api.queries.getUserRegistration);
  const currentUserId = useQuery(api.queries.currentUserId);

  const readMessage = useMutation(api.queries.readMessage);

  const readCurrentMessage = async () => {
    readMessage({ userId: currentUserId as Id<"users">, messageId: messageId });
  };

  useEffect(() => {
    const markMessageAsRead = async () => {
      await readCurrentMessage();
    };
    markMessageAsRead();
  }, [messageId]); // Dependency array to prevent infinite loop

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
    <div className="flex items-start space-x-2">
      {userInfo.avatar ? (
        <Avatar className="w-6 h-6">
          <AvatarImage src={userInfo.avatar} alt="@shadcn" />
          <AvatarFallback>{"S"}</AvatarFallback>
        </Avatar>
      ) : (
        <FaUserCircle className="text-gray-500 w-6 h-6" />
      )}
      <div className="flex flex-col bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-800">
        <span className="font-semibold">{userInfo.name}</span>
        {message.isDeleted === true ? (
          <span className="italic text-gray-500 flex">
            <IoBanOutline className="mt-1 mr-1" />
            <span>This message was deleted</span>
          </span>
        ) : (
          <span>{content}</span>
        )}
        {image && <Image src="" height={200} width={200} alt="message" />}
        <span className="text-end text-gray-700 mb-0 text-xs">
          {convertToTime(createdAt)}
        </span>
      </div>
    </div>
  );
};

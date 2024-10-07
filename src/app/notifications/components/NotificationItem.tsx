"use client";

// src/components/Notifications/NotificationItem.tsx

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Import Shadcn UI Card components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "../../../../types/notification.interface";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notificationTypes } from "../../../../types/notification.types";
import Link from "next/link";

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { type, fromUser, reference, metadata, createdAt, isRead } =
    notification;
  const notificationType = notificationTypes[type];

  const Icon = notificationType.icon;

  const fromUserCommonDetails = useQuery(api.queries.getCommonDetailsByUserId, {
    userId: fromUser as Id<"users">,
  });

  const readNotification = useMutation(api.queries.readNotification);

  const handleNotificationRead = async (
    notificationId: Id<"notifications">
  ) => {
    if (notificationId) {
      readNotification({ notificationId: notificationId });
    }
  };
  if (!notificationType) return null;

  return (
    <Card
      className={`flex items-start border rounded-lg shadow-sm ${isRead ? "bg-white" : "bg-gray-50"} hover:shadow-md transition duration-200`}
    >
      <CardHeader className="flex-shrink-0 p-4 flex items-center">
        {fromUser && metadata?.avatarUrl ? (
          <Avatar>
            <AvatarImage
              src={fromUserCommonDetails?.avatar}
              alt={`${fromUserCommonDetails?.name}'s avatar`}
            />
            <AvatarFallback>
              {fromUserCommonDetails?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          // <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          //   <Icon className={`${notificationType.color} w-6 h-6`} />
          // </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Icon className={`${notificationType.color} w-6 h-6`} />
          </div>
        )}
      </CardHeader>
      <CardContent className="ml-2 flex-1 mt-2 p-4">
        <div className="flex justify-between items-center">
          <p
            onClick={() =>
              handleNotificationRead(notification.id as Id<"notifications">)
            }
          >
            {notification.type === "share" && (
              <>
                <Link
                  href={fromUserCommonDetails?.url || ""}
                  className="text-blue-600 hover:underline"
                >
                  {fromUserCommonDetails?.name}
                </Link>{" "}
                shared your{" "}
                <Link
                  href={reference || ""}
                  className="text-blue-600 hover:underline"
                >
                  post
                </Link>
              </>
            )}
            {notification.type === "like" && (
              <>
                <Link
                  href={fromUserCommonDetails?.url || ""}
                  className="text-blue-600 hover:underline"
                >
                  {fromUserCommonDetails?.name}
                </Link>{" "}
                liked your{" "}
                <Link
                  href={reference || ""}
                  className="text-blue-600 hover:underline"
                >
                  post
                </Link>
              </>
            )}
            {notification.type === "comment" && (
              <>
                <Link
                  href={fromUserCommonDetails?.url || ""}
                  className="text-blue-600 hover:underline"
                >
                  {fromUserCommonDetails?.name}
                </Link>{" "}
                commented on your{" "}
                <Link
                  href={reference || ""}
                  className="text-blue-600 hover:underline"
                >
                  post
                </Link>
              </>
            )}
            {notification.type === "like_comment" && (
              <>
                <Link
                  href={fromUserCommonDetails?.url || ""}
                  className="text-blue-600 hover:underline"
                >
                  {fromUserCommonDetails?.name}
                </Link>{" "}
                liked your{" "}
                <Link
                  href={reference || ""}
                  className="text-blue-600 hover:underline"
                >
                  comment
                </Link>
              </>
            )}
            {notification.type === "profile_view" && (
              <>
                <Link
                  href={fromUserCommonDetails?.url || ""}
                  className="text-blue-600 hover:underline"
                >
                  {fromUserCommonDetails?.name}
                </Link>{" "}
                viewed your profile.
              </>
            )}
          </p>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(createdAt, { addSuffix: true })}

            {!isRead && (
              <span className="text-green-600 ml-2 mr-1 text-lg">●</span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

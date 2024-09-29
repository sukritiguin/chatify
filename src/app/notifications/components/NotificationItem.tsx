// src/components/Notifications/NotificationItem.tsx

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Import Shadcn UI Card components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Notification,
  notificationTypes,
} from "../../../../types/notification.interface";


interface NotificationItemProps {
  notification: Notification;
  onToggleRead?: (id: string, isRead: boolean) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onToggleRead,
}) => {
  const { type, fromUser, reference, metadata, createdAt, isRead } =
    notification;
  const notificationType = notificationTypes[type];

  if (!notificationType) return null;

  const Icon = notificationType.icon;

  return (
    <Card
      className={`flex items-start border rounded-lg shadow-sm ${isRead ? "bg-white" : "bg-gray-50"} hover:shadow-md transition duration-200`}
    >
      <CardHeader className="flex-shrink-0 p-4 flex items-center">
        {fromUser && metadata?.avatarUrl ? (
          <Avatar>
            <AvatarImage
              src={metadata.avatarUrl}
              alt={`${fromUser}'s avatar`}
            />
            <AvatarFallback>{fromUser.charAt(0)}</AvatarFallback>
          </Avatar>
          // <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          //   <Icon className={`${notificationType.color} w-6 h-6`} />
          // </div>
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Icon className={`${notificationType.color} w-6 h-6`} />
          </div>
        )}
      </CardHeader>
      <CardContent className="ml-2 flex-1 p-4">
        <div className="flex justify-between items-center">
          <p
            className={`text-sm ${isRead ? "text-gray-800" : "font-semibold text-blue-600"}`}
          >
            {notificationType.message(fromUser, reference)}
          </p>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center mt-2">
          {!isRead && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          )}
          {onToggleRead && (
            <button
              onClick={() => onToggleRead(notification.id, !isRead)}
              className="text-xs text-blue-600 hover:text-blue-800 transition duration-200 font-medium"
            >
              Mark as {isRead ? "Unread" : "Read"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

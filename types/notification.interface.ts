// src/components/Notifications/types.ts

import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaAt,
  FaUserPlus,
  FaUserCheck,
  FaStar,
  FaEye,
  FaBriefcase,
  FaCalendarAlt,
  FaUsers,
  FaNewspaper,
  FaBullhorn,
} from "react-icons/fa";
import { IconType } from "react-icons";


// src/types/notification.ts

export type NotificationType =
  | "like"
  | "comment"
  | "share"
  | "mention"
  | "connection_request"
  | "connection_accept"
  | "endorsement"
  | "profile_view"
  | "job_posted"
  | "event_invitation"
  | "group_invitation"
  | "article_recommendation"
  | "announcement";

export type ReferenceType =
  | "posts"
  | "comments"
  | "users"
  | "jobs"
  | "events"
  | "groups"
  | "articles"
  | "announcements";

export interface NotificationMetadata {
  message?: string;
  actionUrl?: string;
  avatarUrl?: string;
  // Add more fields as necessary based on notification types
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  referenceId?: string;
  referenceType?: ReferenceType;
  fromUserId?: string;
  fromUser?: string; // Assuming you have the sender's name
  reference?: string; // A short description or title related to the reference
  metadata?: NotificationMetadata;
  createdAt: string; // ISO date string
  isRead: boolean;
}


interface NotificationTypeMapping {
  icon: IconType;
  color: string;
  message: (fromUser?: string, reference?: string) => string;
}

export const notificationTypes: Record<NotificationType, NotificationTypeMapping> = {
  like: {
    icon: FaThumbsUp,
    color: "text-blue-500",
    message: (fromUser, reference) =>
      fromUser && reference
        ? `${fromUser} liked your post "${reference}".`
        : "Someone liked your post.",
  },
  comment: {
    icon: FaComment,
    color: "text-green-500",
    message: (fromUser, reference) =>
      fromUser && reference
        ? `${fromUser} commented on your post "${reference}".`
        : "Someone commented on your post.",
  },
  share: {
    icon: FaShare,
    color: "text-yellow-500",
    message: (fromUser, reference) =>
      fromUser && reference
        ? `${fromUser} shared your post "${reference}".`
        : "Someone shared your post.",
  },
  mention: {
    icon: FaAt,
    color: "text-purple-500",
    message: (fromUser, reference) =>
      fromUser && reference
        ? `${fromUser} mentioned you in "${reference}".`
        : "You were mentioned in a post.",
  },
  connection_request: {
    icon: FaUserPlus,
    color: "text-indigo-500",
    message: (fromUser) =>
      fromUser ? `${fromUser} sent you a connection request.` : "You have a new connection request.",
  },
  connection_accept: {
    icon: FaUserCheck,
    color: "text-green-500",
    message: (fromUser) =>
      fromUser ? `${fromUser} accepted your connection request.` : "Your connection request was accepted.",
  },
  endorsement: {
    icon: FaStar,
    color: "text-yellow-500",
    message: (fromUser, reference) =>
      fromUser && reference
        ? `${fromUser} endorsed your skill "${reference}".`
        : "You have been endorsed for a skill.",
  },
  profile_view: {
    icon: FaEye,
    color: "text-gray-500",
    message: (fromUser) =>
      fromUser ? `${fromUser} viewed your profile.` : "Someone viewed your profile.",
  },
  job_posted: {
    icon: FaBriefcase,
    color: "text-blue-500",
    message: () => `A job matching your profile was posted.`,
  },
  event_invitation: {
    icon: FaCalendarAlt,
    color: "text-pink-500",
    message: (reference) =>
      reference ? `You are invited to the event "${reference}".` : "You have a new event invitation.",
  },
  group_invitation: {
    icon: FaUsers,
    color: "text-teal-500",
    message: (reference) =>
      reference ? `You are invited to join the group "${reference}".` : "You have a new group invitation.",
  },
  article_recommendation: {
    icon: FaNewspaper,
    color: "text-orange-500",
    message: (reference) =>
      reference ? `We recommend the article "${reference}".` : "A new article is recommended for you.",
  },
  announcement: {
    icon: FaBullhorn,
    color: "text-red-500",
    message: (reference) =>
      reference ? `Announcement: "${reference}".` : "There is a new announcement.",
  },
};

// src/components/Notifications/types.ts

import { ReactNode } from "react";
import { IconType } from "react-icons";


// src/types/notification.ts

export type NotificationType =
  | "like"
  | "like_comment"
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

export interface NotificationInterface {
  userId: string; // The user who receives the notification
  type: NotificationType;
  referanceUrl?: string; // Optional URL related to the notification
  referenceId?: string; // ID referencing the related entity (e.g., postId, commentId, userId)
  referenceType?: 
    | "posts"
    | "comments"
    | "users"
    | "jobs"
    | "events"
    | "groups"
    | "articles"
    | "announcements"; // Type of the referenced entity
  fromUserId?: string; // The user who performed the action (if applicable)
  metadata?: {
    message?: string; // Custom message for the notification
    actionUrl?: string; // URL to navigate when the notification is clicked
    // Additional fields can be added as necessary
  };
  createdAt: string; // Timestamp when the notification was created
  isRead: boolean; // Indicates if the notification has been read
}

export interface NotificationTypeMapping {
  icon: IconType;
  color: string;
  message: (fromUser?: string, fromUserUrl?: string, reference?: string) => ReactNode;
}



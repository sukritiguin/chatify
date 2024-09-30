"use client";

import { NotificationItem } from "./components/NotificationItem";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

const NotificationPage = () => {
  // const mockNotifications: Notification[] = [
  //   // Like Notification
  //   {
  //     id: "1",
  //     userId: "1",
  //     type: "like",
  //     fromUser: "Sukriti Guin",
  //     reference: "Post #123",
  //     metadata: { avatarUrl: "https://example.com/avatar1.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Comment Notification
  //   {
  //     id: "2",
  //     userId: "1",
  //     type: "comment",
  //     fromUser: "Jane Smith",
  //     reference: "Post #456",
  //     metadata: { avatarUrl: "https://example.com/avatar2.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: true,
  //   },

  //   // Share Notification
  //   {
  //     id: "3",
  //     userId: "1",
  //     type: "share",
  //     fromUser: "Alex Johnson",
  //     reference: "Post #789",
  //     metadata: { avatarUrl: "https://example.com/avatar3.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Mention Notification
  //   {
  //     id: "4",
  //     userId: "1",
  //     type: "mention",
  //     fromUser: "Emily Davis",
  //     reference: "Post #101",
  //     metadata: { avatarUrl: "https://example.com/avatar4.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Connection Request Notification
  //   {
  //     id: "5",
  //     userId: "2",
  //     type: "connection_request",
  //     fromUser: "Michael Brown",
  //     reference: "",
  //     metadata: { avatarUrl: "https://example.com/avatar5.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Connection Accept Notification
  //   {
  //     id: "6",
  //     userId: "3",
  //     type: "connection_accept",
  //     fromUser: "Linda White",
  //     reference: "",
  //     metadata: { avatarUrl: "https://example.com/avatar6.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: true,
  //   },

  //   // Endorsement Notification
  //   {
  //     id: "7",
  //     userId: "1",
  //     type: "endorsement",
  //     fromUser: "David Green",
  //     reference: "React Development",
  //     metadata: { avatarUrl: "https://example.com/avatar7.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Profile View Notification
  //   {
  //     id: "8",
  //     userId: "2",
  //     type: "profile_view",
  //     fromUser: "Jessica Black",
  //     reference: "",
  //     metadata: { avatarUrl: "https://example.com/avatar8.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Job Posted Notification
  //   {
  //     id: "9",
  //     userId: "1",
  //     type: "job_posted",
  //     fromUser: "",
  //     reference: "",
  //     metadata: { avatarUrl: "https://example.com/avatar9.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Event Invitation Notification
  //   {
  //     id: "10",
  //     userId: "3",
  //     type: "event_invitation",
  //     fromUser: "",
  //     reference: "Tech Conference 2024",
  //     metadata: { avatarUrl: "https://example.com/avatar10.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: true,
  //   },

  //   // Group Invitation Notification
  //   {
  //     id: "11",
  //     userId: "2",
  //     type: "group_invitation",
  //     fromUser: "",
  //     reference: "Web Developers Group",
  //     metadata: { avatarUrl: "https://example.com/avatar11.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },

  //   // Article Recommendation Notification
  //   {
  //     id: "12",
  //     userId: "1",
  //     type: "article_recommendation",
  //     fromUser: "",
  //     reference: "10 Tips for JavaScript Developers",
  //     metadata: { avatarUrl: "https://example.com/avatar12.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: true,
  //   },

  //   // Announcement Notification
  //   {
  //     id: "13",
  //     userId: "1",
  //     type: "announcement",
  //     fromUser: "",
  //     reference: "Company Town Hall Meeting",
  //     metadata: { avatarUrl: "https://example.com/avatar13.png" },
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   },
  // ];

  // const [notifications, setNotifications] = useState(mockNotifications);

  const notifications = useQuery(api.queries.getNotificationsForCurrentUser);

  return (
    <div>
      {notifications && notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={
            {
              id: notification._id,
              userId: notification.userId,
              type: notification.type,
              fromUser: notification.fromUserId,
              reference: notification.referanceUrl,
              metadata: { avatarUrl: "https://example.com/avatar3.png" },
              createdAt: notification.createdAt,
              isRead: notification.isRead,
            }
          }
        />
      ))}
    </div>
  );
};

export default NotificationPage;

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
import {
  NotificationType,
  NotificationTypeMapping,
} from "./notification.interface";
import Link from "next/link";

export const notificationTypes: Record<NotificationType, NotificationTypeMapping> = {
  like: {
    icon: FaThumbsUp,
    color: "text-blue-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          liked your{" "}
          <Link href={reference || ""}>
            post
          </Link>
          .
        </>
      ) : (
        "Someone liked your post."
      ),
  },
  like_comment: {
    icon: FaThumbsUp,
    color: "text-blue-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          liked your{" "}
          <Link href={reference || ""}>
            comment
          </Link>
          .
        </>
      ) : (
        "Someone liked your post."
      ),
  },
  comment: {
    icon: FaComment,
    color: "text-green-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          commented on your{" "}
          <Link href={reference || ""}>
            post
          </Link>
          .
        </>
      ) : (
        "Someone commented on your post."
      ),
  },
  share: {
    icon: FaShare,
    color: "text-yellow-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          shared your{" "}
          <Link href={reference || ""}>
            post
          </Link>
          .
        </>
      ) : (
        "Someone shared your post."
      ),
  },
  mention: {
    icon: FaAt,
    color: "text-purple-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl  || ""}>
            {fromUser}
          </Link>{" "}
          mentioned you in{" "}
          <Link href={reference  || ""}>
            {reference}
          </Link>
          .
        </>
      ) : (
        "You were mentioned in a post."
      ),
  },
  connection_request: {
    icon: FaUserPlus,
    color: "text-indigo-500",
    message: (fromUser, fromUserUrl) =>
      fromUser ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          sent you a connection request.
        </>
      ) : (
        "You have a new connection request."
      ),
  },
  connection_accept: {
    icon: FaUserCheck,
    color: "text-green-500",
    message: (fromUser, fromUserUrl) =>
      fromUser ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          accepted your connection request.
        </>
      ) : (
        "Your connection request was accepted."
      ),
  },
  endorsement: {
    icon: FaStar,
    color: "text-yellow-500",
    message: (fromUser, fromUserUrl, reference) =>
      fromUser && reference ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          endorsed your skill{" "}
          <strong>{reference}</strong>.
        </>
      ) : (
        "You have been endorsed for a skill."
      ),
  },
  profile_view: {
    icon: FaEye,
    color: "text-gray-500",
    message: (fromUser, fromUserUrl) =>
      fromUser ? (
        <>
          <Link href={fromUserUrl || ""}>
            {fromUser}
          </Link>{" "}
          viewed your profile.
        </>
      ) : (
        "Someone viewed your profile."
      ),
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
      reference ? (
        <>You are invited to the event <strong>{reference}</strong>.</>
      ) : (
        "You have a new event invitation."
      ),
  },
  group_invitation: {
    icon: FaUsers,
    color: "text-teal-500",
    message: (reference) =>
      reference ? (
        <>You are invited to join the group <strong>{reference}</strong>.</>
      ) : (
        "You have a new group invitation."
      ),
  },
  article_recommendation: {
    icon: FaNewspaper,
    color: "text-orange-500",
    message: (reference) =>
      reference ? (
        <>We recommend the article <strong>{reference}</strong>.</>
      ) : (
        "A new article is recommended for you."
      ),
  },
  announcement: {
    icon: FaBullhorn,
    color: "text-red-500",
    message: (reference) =>
      reference ? (
        <>Announcement: <strong>{reference}</strong>.</>
      ) : (
        "There is a new announcement."
      ),
  },
};


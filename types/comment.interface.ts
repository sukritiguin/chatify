import { Id } from "../convex/_generated/dataModel";

// Assuming the existing Comment interface from your schema
export interface Comment {
  _id: string;
  postId: Id<"posts">; // ID of the post this comment is associated with
  userId: Id<"users">; // ID of the user who made the comment
  content: string; // Text content of the comment
  parentId?: Id<"comments">; // Optional ID of the parent comment (for nested replies)
  createdAt: string; // Timestamp when the comment was created
  updatedAt: string; // Timestamp of the last update
  reactions?: {
    like: bigint; // Number of likes
    celebrate: bigint; // Number of celebrates
    support: bigint; // Number of supports
    insightful: bigint; // Number of insightful reactions
    love: bigint; // Number of loves
    funny: bigint; // Number of funny reactions
    sad: bigint; // Number of sad reactions
  };
}

// Interface for User Information
export interface UserInfo {
  avatar?: string; // URL to the user's avatar or organization's logo
  name: string; // Name of the user or organization
  userId: string; // ID of the user or organization admin
}

// Interface for a Reply to a Comment
export interface CommentReply {
  comment: Comment; // The reply comment object
  user: UserInfo; // Information about the user who made the reply
}

// Interface for a Top-Level Comment with Replies
export interface CommentWithReplies {
  comment: Comment; // The top-level comment object
  user: UserInfo; // Information about the user who made the comment
  replies: CommentReply[]; // Array of replies to the comment
}

// Example of the overall return type for getCommentByPostId
export type GetCommentsByPostIdResponse = CommentWithReplies[];

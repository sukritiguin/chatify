import { Id } from "../convex/_generated/dataModel";

export interface IMessage {
  conversationId: Id<"conversation">; // The conversation this message belongs to
  senderId: string; // The user who sent the message
  content: string; // The message text content
  media?: string[]; // URLs of media (images, videos, documents), optional
  createdAt: string; // Timestamp when the message was sent
  updatedAt?: string; // Timestamp of the last update (optional, for editing the message)
  isDeleted?: boolean; // If the message has been deleted (optional)
  isEdited?: boolean; // If the message has been edited (optional)
}

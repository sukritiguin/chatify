import { Id } from "../convex/_generated/dataModel";

export interface ConnectionType{
  _id: Id<"connection">;
  _creationTime: number;
  status: "pending" | "accepted" | "rejected";
  sender: Id<"users">;
  receiver: Id<"users">;
}
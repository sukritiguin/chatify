import { Id } from "../../../convex/_generated/dataModel";
import MessageComponent from "./components/MessageBase";

const MessagePage = () => {
  return <><MessageComponent conversationId={"" as Id<"conversation">}/></>;
}

export default MessagePage;
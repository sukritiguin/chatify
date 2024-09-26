import MessageComponent from "@/app/message/components/MessageBase";
import { Id } from "../../../../convex/_generated/dataModel";

const ConversationPage = ({
  params,
}: {
  params: { conversationId: string };
}) => {
  return (
    <>
      <MessageComponent
        conversationId={params.conversationId as Id<"conversation">}
      />
    </>
  );
};

export default ConversationPage;

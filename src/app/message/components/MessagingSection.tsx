"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiChevronUp } from "react-icons/fi";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { SingleMessageCardInMessagingSection } from "./SingleMesssageCardInMessagingSection";
import { Id } from "../../../../convex/_generated/dataModel";


const MessagingSection: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const allConversations: {
    conversationId: Id<"conversation">;
    name: string;
    avatar: string;
    unseenMessageCount: number;
    lastUnseenMessage: string;
    userId: Id<"users">;
  }[] = useQuery(api.queries.getAllConversationDetails);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        messagesContainerRef.current;
      setShowScrollButton(scrollHeight > scrollTop + clientHeight);
    }
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="p-6 bg-gray-50 rounded-lg shadow-lg max-h-screen overflow-y-auto"
      ref={messagesContainerRef}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">Messages</h2>
      <div className="space-y-4">
        {allConversations &&
          Object.values(allConversations).map(
            (conversation: {
              conversationId: Id<"conversation">;
              name: string;
              avatar: string;
              unseenMessageCount: number;
              lastUnseenMessage: string;
              userId: Id<"users">;
            }) => (
              <SingleMessageCardInMessagingSection key={conversation.conversationId} participant={conversation} />
            )
          )}
      </div>
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-blue-600 text-white hover:bg-blue-700 transition"
          aria-label="Scroll to top"
        >
          <FiChevronUp />
        </Button>
      )}
    </div>
  );
};

export default MessagingSection;

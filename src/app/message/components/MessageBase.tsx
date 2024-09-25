"use client";

import { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReceivedMessage } from "./ReceivedMessage";
import { SentMessage } from "./SentMessage";
import Picker, { EmojiClickData } from "emoji-picker-react"; // Import the emoji picker
import ImageUploadModal from "./ImageUploadModal";
import { IoSend } from "react-icons/io5";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const MessageComponent = ({
  conversationId,
}: {
  conversationId: Id<"conversation">;
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // State to hold uploaded files

  // Logic to start build conversation

  const sender = useQuery(api.queries.currentUserId);

  const conversation = useQuery(
    api.queries.getExistingConversationByConversationId,
    { conversationId: conversationId }
  );

  const receiver =
    conversation?.firstUser === sender
      ? conversation?.secondUser
      : conversation?.firstUser;

  const createNewMessage = useMutation(api.queries.createNewMessage);

  const allMessages = useQuery(api.queries.getMessageByConversationId, {
    conversationId: conversationId,
  });

  let userInfo: {
    name: string;
    avatar: string;
    profileUrl: string;
  } = { name: "", avatar: "", profileUrl: "" };

  const userRegistedAs = useQuery(api.queries.getUserRegistration);

  if (userRegistedAs?.type == "profile") {
    const profile = useQuery(api.queries.getUserProfileById, {
      userId: receiver as Id<"users">,
    });

    userInfo = {
      name: profile?.name as string,
      avatar: profile?.profilePhoto as string,
      profileUrl: `/profile/${profile?.userId}`,
    };
  } else {
    const organization = useQuery(api.queries.getOrganizationByUserId, {
      userId: receiver as Id<"users">,
    });

    userInfo = {
      name: organization?.name as string,
      avatar: organization?.logo as string,
      profileUrl: `/organization/${organization?.adminUserId}`,
    };
  }

  const onEmojiClick = (emojiData: EmojiClickData, event: unknown) => {
    // console.log({ emojiObject: emojiObject });
    console.log(event);
    // setMessage((prev) => prev + emojiData.emoji); // Append emoji to the current message
    // setShowEmojiPicker(false); // Close the emoji picker after selection

    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current;

      // Insert emoji at the cursor position
      const newMessage =
        message.slice(0, selectionStart === null ? 0 : selectionStart) +
        emojiData.emoji +
        message.slice(selectionEnd === null ? 0 : selectionEnd);

      setMessage(newMessage);

      // Set the cursor position after the emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart =
            selectionStart === null
              ? 0
              : selectionStart + emojiData.emoji.length;
          inputRef.current.selectionEnd =
            selectionStart === null
              ? 0
              : selectionStart + emojiData.emoji.length;
          inputRef.current.focus(); // Ensure the input is focused
        }
      }, 0);
    }
    setShowEmojiPicker(false); // Close the emoji picker after selection
  };

  const onSendMessage = async () => {
    console.log({
      content: message,
      conversationId: conversationId,
    });
    await createNewMessage({
      content: message,
      conversationId: conversationId,
    });
    setMessage("");
  };

  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Message Card */}
      <Card>
        {/* Header */}
        <CardHeader className="flex justify-between items-center p-4 bg-gray-100">
          <div className="flex items-center space-x-2 hover:underline hover:cursor-pointer"
            onClick={()=>{router.push(userInfo.profileUrl)}}
          >
            {userInfo.avatar ? (
              <Avatar className="w-6 h-6">
                <AvatarImage src={userInfo.avatar} alt="@shadcn" />
                <AvatarFallback>{"S"}</AvatarFallback>
              </Avatar>
            ) : (
              <FaUserCircle className="text-gray-500 w-6 h-6" />
            )}
            <span className="font-semibold text-gray-800">{userInfo.name}</span>
          </div>
        </CardHeader>

        {/* Image Upload Modal */}
        {isModalOpen && (
          <ImageUploadModal
            isOpen={isModalOpen}
            onClose={setIsModalOpen}
            setFiles={setFiles} // Pass the setFiles state to the modal
          />
        )}
        {/* Message History */}
        <CardContent className="space-y-4 h-64 overflow-y-auto p-4">
          {allMessages &&
            allMessages.map((message, index) => (
              <div key={message._id}>
                {message.senderId == sender ? (
                  <SentMessage
                    content={message.content}
                    messageUserId={message.senderId}
                  />
                ) : (
                  <ReceivedMessage
                    content={message.content}
                    messageUserId={message.senderId}
                  />
                )}
              </div>
            ))}
        </CardContent>

        {/* Input Section */}
        <CardFooter className="border-t px-4 py-2 relative">
          <div className="flex items-center space-x-2 w-full">
            <BsEmojiSmile
              className="text-gray-500 w-6 h-6 cursor-pointer"
              onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle the emoji picker
            />
            <AiOutlinePaperClip
              className="text-gray-500 w-6 h-6 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <Input
              placeholder="Write a message..."
              className="px-3 py-2 border rounded-lg flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update input state
              ref={inputRef}
            />
            <IoSend
              className="hover:cursor-pointer hover:text-gray-800 text-gray-700"
              onClick={() => onSendMessage()}
            />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0">
              <Picker onEmojiClick={onEmojiClick} height={300} />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageComponent;

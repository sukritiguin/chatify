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

export const formatDateForWhatsApp = (dateString: string) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Remove the time part for accurate comparison of just dates
  const inputDateOnly = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Calculate the difference in days between input date and today (ignoring time)
  const diffInTime = todayOnly.getTime() - inputDateOnly.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

  // Format date as DD/MM/YYYY
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1; // Months are zero-based
  const year = inputDate.getFullYear();

  if (diffInDays === 0) {
    return "Today"; // Same day
  } else if (diffInDays === 1) {
    return "Yesterday"; // One day before
  } else {
    return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`; // DD/MM/YYYY
  }
};

const MessageComponent = ({
  conversationId,
}: {
  conversationId: Id<"conversation">;
}) => {
  // const [currentDate, setCurrentDate] = useState("");
  let currentDate = "";
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

  // Inside the component
  // useEffect(() => {
  //   if (allMessages && allMessages.length > 0) {
  //     const lastMessageDate = allMessages[allMessages.length - 1].createdAt;
  //     const formattedDate = formatDateForWhatsApp(lastMessageDate);
  //     setCurrentDate(formattedDate);
  //   }
  // }, [allMessages]);

  const router = useRouter();

  return (
    <div className="max-w-2xl min-h-screen mx-auto my-0">
      {/* Message Card */}
      <Card>
        {/* Header */}
        <CardHeader className="flex justify-between items-center p-4 bg-gray-100">
          <div
            className="flex items-center space-x-2 hover:underline hover:cursor-pointer"
            onClick={() => {
              router.push(userInfo.profileUrl);
            }}
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
        <CardContent className="space-y-4 h-[65vh] overflow-y-auto p-4">
          {allMessages &&
            allMessages.map((message) => {
              const messageDate = formatDateForWhatsApp(message.createdAt);
              const shouldShowDate = currentDate !== messageDate;
              currentDate = messageDate;

              return (
                <div key={message._id}>
                  {shouldShowDate && (
                    <div className="flex justify-center items-center my-4">
                      <span className="text-sm bg-green-100 text-gray-600 rounded-full px-3 py-1">
                        {messageDate}
                      </span>
                    </div>
                  )}
                  {message.senderId == sender ? (
                    <SentMessage
                      message={message}
                      content={message.content}
                      messageUserId={message.senderId}
                      createdAt={message.createdAt}
                      receiverId={receiver as Id<"users">}
                      messageId={message._id}
                    />
                  ) : (
                    <ReceivedMessage
                      message={message}
                      content={message.content}
                      messageUserId={message.senderId}
                      messageId={message._id}
                      createdAt={message.createdAt}
                    />
                  )}
                </div>
              );
            })}
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

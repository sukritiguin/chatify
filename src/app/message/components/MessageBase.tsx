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

const MessageComponent = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // State to hold uploaded files

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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Message Card */}
      <Card>
        {/* Header */}
        <CardHeader className="flex justify-between items-center p-4 bg-gray-100">
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-500 w-8 h-8" />
            <span className="font-semibold text-gray-800">John Doe</span>
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
          {/* User Message */}
          <ReceivedMessage />
          {/* My Message */}
          <SentMessage />
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
              onClick={() => console.log(files)}
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

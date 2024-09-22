"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns"; // For formatting timestamps

interface PostProps {
  post: {
    id: string;
    content: string;
    images?: string[];
    user: {
      name: string;
      profileImage: string;
    };
    createdAt: string;
    visibility: "public" | "connections" | "private";
  };
}

const reactions = [
  { emoji: "👍🏾", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Funny" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😮", label: "Insightful" },
  { emoji: "🤝", label: "Support" },
  { emoji: "🎉", label: "Celebrate" },
];

const Post: React.FC<PostProps> = ({ post }) => {
  const { content, images = [], user, createdAt } = post;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false); // Track reaction dropdown
  const [likedReaction, setLikedReaction] = useState<string | null>(null); // Track liked reaction
  const [comment, setComment] = useState(""); // Track user comment

  // Open the dialog
  const openDialog = () => {
    setDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedImageUrl(null); // Reset selected image URL
  };

  // Open dialog with selected image
  const openImageDialog = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    openDialog();
  };

  // Handle reaction selection
  const handleReactionSelect = (reaction: string) => {
    setLikedReaction(reaction);
    setShowReactions(false); // Close the dropdown after selecting
    console.log(`Post liked with reaction: ${reaction}`);
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", comment);
    setComment(""); // Reset comment input
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-300 max-w-md mx-auto">
      {/* User Information */}
      <div className="flex items-center mb-4">
        <Image
          src={user.profileImage}
          alt={user.name}
          className="w-12 h-12 rounded-full border-2 border-blue-500 mr-3"
          height={48}
          width={48}
        />
        <div>
          <span className="font-semibold text-lg">{user.name}</span>
          <span className="text-gray-500 text-sm ml-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-2 text-base">{content}</p>

      {/* Images */}
      {images.length > 0 && (
        <div className="relative mb-4">
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 3).map((imageUrl, index) => (
              <div key={index} className="cursor-pointer">
                <Image
                  src={imageUrl}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg transition-transform transform hover:scale-105"
                  height={160}
                  width={200}
                  onClick={() => openImageDialog(imageUrl)} // Click handler
                />
              </div>
            ))}

            {images.length > 3 && (
              <div className="relative cursor-pointer">
                <Image
                  src={images[3]}
                  alt="More images"
                  className="w-full h-40 object-cover rounded-lg"
                  height={160}
                  width={200}
                  onClick={openDialog} // Open dialog when this image is clicked
                />
                <button
                  onClick={openDialog}
                  className="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-gray-700 bg-opacity-70 text-white rounded-lg"
                >
                  +{images.length - 3} more images
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex justify-between text-gray-600 mt-4 relative">
        <div
          className="flex items-center relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button className="flex items-center hover:text-blue-500">
            <FaThumbsUp className="mr-1" />
            {likedReaction ? likedReaction : "Like"}
            {likedReaction && (
              <span className="ml-1">
                {reactions.find((r) => r.label === likedReaction)?.emoji}
              </span>
            )}
          </button>
          {showReactions && (
            <div className="absolute top-2 left-0 z-10 bg-white shadow-lg rounded-lg border border-gray-300 mt-2 flex space-x-2 p-2">
              {reactions.map((reaction) => (
                <button
                  key={reaction.label}
                  className="flex items-center p-1 hover:bg-gray-50 hover:rounded-full cursor-pointer"
                  onClick={() => handleReactionSelect(reaction.label)}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="flex items-center hover:text-blue-500">
          <FaComment className="mr-1" />
          Comment
        </button>
        <button className="flex items-center hover:text-blue-500">
          <FaShare className="mr-1" />
          Share
        </button>
      </div>

      {/* Comment Input Box (conditionally rendered) */}
      {likedReaction && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center">
          <Image
            src={user.profileImage}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500 mr-2"
            height={40}
            width={40}
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border rounded-lg p-2 flex-grow"
          />
          {comment && (
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
            >
              Post
            </button>
          )}
        </form>
      )}

      {/* Dialog for Images */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeDialog}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="cursor-pointer">
                  <Image
                    src={imageUrl}
                    alt={`Dialog Image ${index + 1}`}
                    className="w-full object-contain rounded-lg cursor-pointer" // Maintain aspect ratio
                    height={400}
                    width={400}
                    onClick={() => openImageDialog(imageUrl)} // Click handler for dialog
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup Image Viewer */}
      {selectedImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <button
            onClick={closeDialog}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          <Image
            src={selectedImageUrl}
            alt="Selected Image"
            className="max-w-full max-h-[90vh] object-contain"
            height={600}
            width={600}
          />
        </div>
      )}
    </div>
  );
};

export default Post;

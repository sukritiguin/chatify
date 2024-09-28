"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaThumbsUp, FaComment, FaShare, FaEdit } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns"; // For formatting timestamps
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { SingleCommand } from "./Command";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import { EditPost } from "./EditPost";
import Link from "next/link";

interface PostProps {
  post: {
    id: string;
    content: string;
    images?: string[];
    user: {
      name: string;
      profileImage: string;
      userId: Id<"users">;
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
  const [comment, setComment] = useState(""); // Track user comment
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isEditPostDialogOpen, setEditPostDialogOpen] = useState(false);
  const [isDeleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    useState(false);

  const [likedReaction, setLikedReaction] = useState<string | null>(null); // Track liked reaction

  const likePost = useMutation(api.queries.likePost);
  const existingReaction = useQuery(api.queries.getReaction, {
    postId: post.id as Id<"posts">,
  });
  const reactionCount = useQuery(api.queries.getReactionCountByPostId, {
    postId: post.id as Id<"posts">,
  });

  const postComment = useMutation(api.queries.postComment);

  const totalComments = useQuery(api.queries.totalCommentsByPostId, {
    postId: post.id as Id<"posts">,
  });

  const currentUserId = useQuery(api.queries.currentUserId);

  const currentOrganizationAvatar = useQuery(api.queries.getOrganization)?.logo;
  const currentProfileAvatar = useQuery(
    api.queries.getUserProfile
  )?.profilePhoto;

  const deletePost = useMutation(api.queries.deletePost);

  const userRegistedAs = useQuery(api.queries.getUserRegistrationById, {
    registeredUserId: post.user.userId,
  });

  console.log({ existingReaction: existingReaction });

  useEffect(() => {
    if (existingReaction) {
      setLikedReaction(existingReaction?.reactionType);
    }
  }, [existingReaction]);

  const handleDeleteClick = () => {
    setDeleteConfirmationDialogOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = () => {
    deletePost({ postId: post.id as Id<"posts"> });
    setDeleteConfirmationDialogOpen(false); // Close dialog after confirmation
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationDialogOpen(false); // Close dialog without deleting
  };

  // Open the dialog
  const openDialog = () => {
    setDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedImageUrl(null); // Reset selected image URL
  };
  // Open the comment dialog
  const openCommentDialog = () => {
    setCommentDialogOpen(true);
  };

  // Close the comment dialog
  const closeCommentDialog = () => {
    setCommentDialogOpen(false);
  };
  // Open dialog with selected image
  const openImageDialog = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    openDialog();
  };

  // Handle reaction selection
  const handleReactionSelect = (reaction: string) => {
    if (likedReaction !== null) {
      likePost({
        postId: post.id as Id<"posts">,
        reactionType: likedReaction as
          | "Celebrate"
          | "Support"
          | "Insightful"
          | "Sad"
          | "Funny"
          | "Love"
          | "Like",
        increase: false,
      });
    }
    setLikedReaction(reaction);
    setShowReactions(false); // Close the dropdown after selecting
    console.log(`Post liked with reaction: ${reaction}`);

    likePost({
      postId: post.id as Id<"posts">,
      reactionType: reaction as
        | "Celebrate"
        | "Support"
        | "Insightful"
        | "Sad"
        | "Funny"
        | "Love"
        | "Like",
      increase: true,
    });
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", comment);
    setComment(""); // Reset comment input

    const data = {
      postId: post.id as Id<"posts">,
      content: comment,
      parentId: undefined,
      reactions: {
        like: 0n, // Number of likes
        celebrate: 0n, // Number of celebrates
        support: 0n, // Number of supports
        insightful: 0n, // Number of insightful reactions
        love: 0n, // Number of loves
        funny: 0n, // Number of funny
        sad: 0n, // Number of sad
      },
    };

    await postComment({ data: data });
    openCommentDialog();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-300 max-w-2xl mx-auto">
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
          <Link
            href={
              userRegistedAs?.type === "profile"
                ? `/profile/${post.user.userId}`
                : `/organization/${post.user.userId}`
            }
            className="hover:underline"
          >
            <span className="font-semibold text-lg">{user.name}</span>
          </Link>
          <span className="text-gray-500 text-sm ml-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        {post.user.userId === currentUserId && (
          <div className="flex justify-center items-center ml-auto">
            <div
              className="ml-auto p-2 text-red-500 hover:text-red-600 hover:cursor-pointer"
              onClick={() => setEditPostDialogOpen(true)}
            >
              <FaEdit />
            </div>
            <div
              className="ml-auto hover:cursor-pointer text-red-500 hover:text-red-600"
              onClick={handleDeleteClick}
            >
              <MdDeleteForever />
            </div>
          </div>
        )}

        {/* Edit Post Dialog */}

        <EditPost
          isOpen={isEditPostDialogOpen}
          setOpen={setEditPostDialogOpen}
          postId={post.id as Id<"posts">}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          message="Are you sure you want to delete this post?"
          isOpen={isDeleteConfirmationDialogOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>

      {/* Post Content */}
      <Link href={`/feed/${post.id}`}>
        <p className="text-gray-800 mb-2 text-base">{content}</p>
      </Link>

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

      <div className="flex flex-col mt-4 relative">
        <div className="p-2 rounded-t-lg">
          <div className="flex justify-between text-gray-600">
            <span className="text-green-500">{reactionCount} likes</span>
            <span className="text-green-500">{totalComments} comments</span>
            <span className="text-green-500">{0} shares</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between text-gray-600 mt-1 relative">
          <div
            className="flex items-center relative"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            <button className="flex flex-col items-center hover:text-blue-500">
              <div className="flex items-center">
                {likedReaction ? (
                  reactions
                    .filter(
                      (reaction) =>
                        reaction.label.toLowerCase() ===
                        likedReaction.toLowerCase()
                    )
                    .map((reaction) => reaction.emoji)[0] // Access the emoji of the first filtered reaction
                ) : (
                  <FaThumbsUp className="mr-1" />
                )}
                <span>{likedReaction ? likedReaction : "Like"}</span>
                {/* {likedReaction && (
                  <span className="ml-1">
                    {reactions.find((r) => r.label === likedReaction)?.emoji}
                  </span>
                )} */}
              </div>
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

          <button
            className="flex items-center hover:text-blue-500"
            onClick={openCommentDialog}
          >
            <FaComment className="mr-1" />
            Comment
          </button>

          <button className="flex items-center hover:text-blue-500">
            <FaShare className="mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Comment Input Box (conditionally rendered) */}
      {likedReaction && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center">
          <Image
            src={currentOrganizationAvatar || (currentProfileAvatar as string)}
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

      {isCommentDialogOpen && (
        <SingleCommand
          closeCommentDialog={closeCommentDialog}
          user={user}
          postId={post.id}
        />
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

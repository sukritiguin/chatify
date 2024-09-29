"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import ConfirmationDialog from "@/components/ui/confirmationDialog";
import { Id } from "../../../../convex/_generated/dataModel";
import { CommentWithReplies } from "../../../../types/comment.interface";
// import { Id } from "../../../../convex/_generated/dataModel";

// interface commentInterface {
//   comment: {
//     _id: Id<"comments">;
//     createdAt: string;
//     content: string;
//   };
//   user: {
//     name: string;
//     avatar: string;
//   };
// }

interface SingleCommandInterface {
  comment: CommentWithReplies;
  handleReply: any;
  hoveredComment: any;
  setHoveredComment: any;
  reactions: any;
  isReply: boolean;
}

export const SingleComment = ({
  comment,
  handleReply,
  hoveredComment,
  setHoveredComment,
  reactions,
  isReply,
}: SingleCommandInterface) => {
  const [isDeleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    useState(false);
  const deleteComment = useMutation(api.queries.deleteComment);
  const currentUserId = useQuery(api.queries.currentUserId);

  const [likedReaction, setLikedReaction] = useState<string | null>(null); // Track liked reaction
  const likeComment = useMutation(api.queries.likeComment);
  const existingReaction = useQuery(api.queries.getCommentReaction, {
    commentId: comment.comment._id as Id<"comments">,
  });
  const reactionCount = useQuery(
    api.queries.getCommentReactionCountByCommentId,
    {
      commentId: comment.comment._id as Id<"comments">,
    }
  );
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
    deleteComment({ commentId: comment.comment._id as Id<"comments"> });
    setDeleteConfirmationDialogOpen(false); // Close dialog after confirmation
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationDialogOpen(false); // Close dialog without deleting
  };

  const handleReactionSelect = (reaction: string) => {
    if (likedReaction !== null) {
      likeComment({
        commentId: comment.comment._id as Id<"comments">,
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
    setHoveredComment(null); // Close the dropdown after selecting
    console.log(`Post liked with reaction: ${reaction}`);

    likeComment({
      commentId: comment.comment._id as Id<"comments">,
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

  return (
    <div key={comment.comment._id} className="flex items-start space-x-3">
      <Image
        src={comment.user.avatar as string}
        alt="User"
        className="w-10 h-10 rounded-full"
        height={40}
        width={40}
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold">
            {comment.user.name} {"●"}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            {formatDistanceToNow(new Date(comment.comment.createdAt), {
              addSuffix: true,
            })}
          </span>
          {comment.user.userId === currentUserId && (
            <div
              className="flex ml-4 hover:cursor-pointer text-red-500 hover:text-red-600"
              onClick={handleDeleteClick}
            >
              <MdDeleteForever />
            </div>
          )}
          <ConfirmationDialog
            message="Are you sure you want to delete this comment?"
            isOpen={isDeleteConfirmationDialogOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
        <p className="text-gray-600">{comment.comment.content}</p>
        {!isReply && (
          <div className="mt-2 flex space-x-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => handleReply(comment.comment._id)}
            >
              Reply
            </button>
            <div
              className="relative"
              onMouseEnter={() => setHoveredComment(comment.comment._id)}
              onMouseLeave={() => setHoveredComment(null)}
            >
              <button className="text-gray-600 hover:text-gray-900">
                {likedReaction
                  ? reactions.find(
                      (r: { emoji: string; label: string }) =>
                        r.label === likedReaction
                    )?.emoji + likedReaction
                  : existingReaction
                    ? reactions.find(
                        (r: { emoji: string; label: string }) =>
                          r.label === existingReaction.reactionType
                      )?.emoji + existingReaction.reactionType
                    : "Like"}
              </button>
              {hoveredComment && hoveredComment === comment.comment._id && (
                <div className="absolute top-2 left-0 z-10 bg-white shadow-lg rounded-lg border border-gray-300 -mt-5 flex space-x-2 p-2">
                  {reactions.map((reaction: any) => (
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
              className="text-blue-400"
            >
              {reactionCount} Reactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

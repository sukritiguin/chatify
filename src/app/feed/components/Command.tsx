"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import React, { FormEvent, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SingleComment } from "./SingleCommand";

const reactions = [
  { emoji: "👍🏾", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Funny" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😮", label: "Insightful" },
  { emoji: "🤝", label: "Support" },
  { emoji: "🎉", label: "Celebrate" },
];

export const SingleCommand = ({
  closeCommentDialog,
  user,
  postId,
}: {
  closeCommentDialog: any;
  user: any;
  postId: any;
}) => {
  const [mainComment, setMainComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  // const [showReactions, setShowReactions] = useState(false);
  const [hoveredComment, setHoveredComment] = useState<Id<"comments"> | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<Id<"comments"> | null>(null);

  const commentDialogRef = useRef<HTMLDivElement | null>(null);

  const postComment = useMutation(api.queries.postComment);

  const comments = useQuery(api.queries.getCommentByPostId, { postId: postId });

  const currentOrganizationAvatar = useQuery(api.queries.getOrganization)?.logo;
  const currentProfileAvatar = useQuery(
    api.queries.getUserProfile
  )?.profilePhoto;

  const handleReply = (commentId: Id<"comments">) => {
    setReplyingTo(commentId);
    commentDialogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReactionSelect = (reaction: string) => {
    console.log({ reaction: reaction });
    setHoveredComment(null);
  };

  const handleMainCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      postId: postId,
      content: mainComment,
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
    setMainComment("");
  };

  const handleReplyComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({ "comment reply content": replyComment });

    const data = {
      postId: postId as Id<"posts">,
      content: replyComment,
      parentId: replyingTo as Id<"comments">,
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
    setReplyComment("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={closeCommentDialog}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>

        {/* Existing Comments */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <div className="space-y-4">
            {comments &&
              comments.map((comment) => (
                <React.Fragment key={comment.comment._id}>
                  <SingleComment
                    comment={comment}
                    handleReply={handleReply}
                    hoveredComment={hoveredComment}
                    setHoveredComment={setHoveredComment}
                    reactions={reactions}
                    handleReactionSelect={handleReactionSelect}
                    isReply={false}
                  />
                  {comment.replies.map((reply: any) => (
                    <div
                      className="ml-12"
                      key={`${reply.comment._id}-${comment.comment._id}`}
                    >
                      <SingleComment
                        comment={reply}
                        handleReply={handleReply}
                        hoveredComment={hoveredComment}
                        setHoveredComment={setHoveredComment}
                        reactions={reactions}
                        handleReactionSelect={handleReactionSelect}
                        isReply={true}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* Write New Comment */}
        <form onSubmit={handleMainCommentSubmit} className="flex items-center">
          <Image
            src={currentOrganizationAvatar || (currentProfileAvatar as string)}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500 mr-2"
            height={40}
            width={40}
          />
          <input
            type="text"
            value={mainComment}
            onChange={(e) => setMainComment(e.target.value)}
            placeholder="Write a comment..."
            className="border rounded-lg p-2 flex-grow"
            disabled={false}
          />
          {mainComment && (
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
            >
              Post
            </button>
          )}
        </form>

        {/* Reply Input Box */}
        <div className="" ref={commentDialogRef}>
          {replyingTo !== null && (
            <div className="mt-4 border-t pt-2">
              <h4 className="text-lg font-semibold">
                Replying to comment #{" "}
                <span
                  className="filter blur-sm"
                  style={{
                    userSelect: "none" /* Prevents text selection */,
                    WebkitUserSelect: "none" /* For Safari */,
                    MozUserSelect: "none" /* For Firefox */,
                  }}
                >
                  {replyingTo}
                </span>
              </h4>
              <form
                onSubmit={handleReplyComment}
                className="flex items-center mt-2"
              >
                <Image
                  src={
                    (currentOrganizationAvatar as string) ||
                    (currentProfileAvatar as string)
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 mr-2"
                  height={40}
                  width={40}
                />
                <input
                  type="text"
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="border rounded-lg p-2 flex-grow"
                />
                {replyComment && (
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-2"
                  >
                    Reply
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

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
  const [comment, setComment] = useState("");
  // const [showReactions, setShowReactions] = useState(false);
  const [hoveredComment, setHoveredComment] = useState<Id<"comments"> | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<Id<"comments"> | null>(null);

  const postComment = useMutation(api.queries.postComment);

  const comments = useQuery(api.queries.getCommentByPostId, { postId: postId });

  const handleReply = (commentId: Id<"comments">) => {
    setReplyingTo(commentId);
  };

  const handleReactionSelect = (reaction: string) => {
    console.log({ reaction: reaction });
    setHoveredComment(null);
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      postId: postId,
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
    setComment("");
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
                <div
                  key={comment.comment._id}
                  className="flex items-start space-x-3"
                >
                  <Image
                    src={comment.user.avatar as string}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                    height={40}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="font-semibold">{comment.user.name} {"●"}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {formatDistanceToNow(
                          new Date(comment.comment.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.comment.content}</p>
                    <div className="mt-2 flex space-x-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleReply(comment.comment._id)}
                      >
                        Reply
                      </button>
                      <div
                        className="relative"
                        onMouseEnter={() =>
                          setHoveredComment(comment.comment._id)
                        }
                        onMouseLeave={() => setHoveredComment(null)}
                      >
                        <button className="text-gray-600 hover:text-gray-900">
                          Like
                        </button>
                        {hoveredComment &&
                          hoveredComment === comment.comment._id && (
                            <div className="absolute top-2 left-0 z-10 bg-white shadow-lg rounded-lg border border-gray-300 -mt-5 flex space-x-2 p-2">
                              {reactions.map((reaction) => (
                                <button
                                  key={reaction.label}
                                  className="flex items-center p-1 hover:bg-gray-50 hover:rounded-full cursor-pointer"
                                  onClick={() =>
                                    handleReactionSelect(reaction.label)
                                  }
                                >
                                  <span className="text-lg">
                                    {reaction.emoji}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Write New Comment */}
        <form onSubmit={handleCommentSubmit} className="flex items-center">
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
            placeholder="Write a comment..."
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

        {/* Reply Input Box */}
        {replyingTo !== null && (
          <div className="mt-4 border-t pt-2">
            <h4 className="text-lg font-semibold">
              Replying to comment #{replyingTo}
            </h4>
            <form onSubmit={() => {}} className="flex items-center mt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a reply..."
                className="border rounded-lg p-2 flex-grow"
              />
              {comment && (
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
  );
};

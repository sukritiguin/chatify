/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useState } from "react";

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
}: {
  closeCommentDialog: any;
  user: any;
}) => {
  const [comment, setComment] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleReactionSelect = (reaction: string) => {
    console.log({ reaction: reaction });
    setShowReactions(false);
  };

  const comments = [
    {
      id: 1,
      userName: "Demo user 1",
      text: "This is a demo comment.",
      avatar: ""
    },
    {
      id: 2,
      userName: "Demo user 2",
      text: "Another insightful comment here!",
      avatar: ""
    },
  ];

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
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Image
                  src={comment.avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                  height={40}
                  width={40}
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{comment.userName}</span>
                  <p className="text-gray-600">{comment.text}</p>
                  <div className="mt-2 flex space-x-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleReply(comment.id)}
                    >
                      Reply
                    </button>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowReactions(true)}
                      onMouseLeave={() => setShowReactions(false)}
                    >
                      <button className="text-gray-600 hover:text-gray-900">
                        Like
                      </button>
                      {showReactions && (
                        <div className="absolute top-2 left-0 z-10 bg-white shadow-lg rounded-lg border border-gray-300 -mt-5 flex space-x-2 p-2">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.label}
                              className="flex items-center p-1 hover:bg-gray-50 hover:rounded-full cursor-pointer"
                              onClick={() =>
                                handleReactionSelect(reaction.label)
                              }
                            >
                              <span className="text-lg">{reaction.emoji}</span>
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
        <form onSubmit={() => {}} className="flex items-center">
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
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
  comment: any;
  handleReply: any;
  hoveredComment: any;
  setHoveredComment: any;
  reactions: any;
  handleReactionSelect: any;
  isReply: boolean;
}

export const SingleComment = ({
  comment,
  handleReply,
  hoveredComment,
  setHoveredComment,
  reactions,
  handleReactionSelect,
  isReply
}: SingleCommandInterface) => {
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
        </div>
        <p className="text-gray-600">{comment.comment.content}</p>
        {!isReply && <div className="mt-2 flex space-x-4">
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
            <button className="text-gray-600 hover:text-gray-900">Like</button>
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
        </div>}
      </div>
    </div>
  );
};

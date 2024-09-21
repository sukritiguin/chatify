import React from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

const FollowAndFollowing = ({ isFollowing }: { isFollowing: boolean }) => {
  return (
    <div className="flex ml-2 max-h-12">
      <div className="flex items-center my-2 mx-0 bg-blue-700 py-2 px-3 rounded-full hover:shadow-lg hover:cursor-pointer">
        {isFollowing ? (
          <FaCheck className="text-gray-200 hover:text-gray-250" />
        ) : (
          <FaPlus className="text-gray-100 hover:text-gray-250" />
        )}
        <span
          className={`ml-2 text-sm font-bold hover:text-gray-250 ${isFollowing ? "text-gray-100" : "text-gray-200"}`}
        >
          {isFollowing ? "Following" : "Follow"}
        </span>
      </div>
    </div>
  );
};

export default FollowAndFollowing;

"use client";
import { useQuery } from "convex/react";
import Post from "./components/Post";
import PostCreator from "./components/PostCreator";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface PostDataInterface {
  id: string;
  content: string;
  images?: string[];
  user: {
    userId: Id<"users">;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  visibility: "public" | "connections" | "private";
  sharedPostId: string | undefined;
}

const FeedPage = () => {
  const allPosts = useQuery(api.queries.getAllPosts);

  if (!allPosts) return <></>;

  return (
    <div className="">
      <PostCreator />
      {allPosts.map((singlePost) => {
        const name = singlePost.profile?.name || singlePost.organization?.name;
        const profileImage =
          singlePost.profile?.profilePhoto || singlePost.organization?.logo;

        const post: PostDataInterface = {
          id: singlePost.post._id,
          content: singlePost.post.content,
          images: singlePost.post.media,
          user: {
            userId: singlePost.post.userId,
            name: name as string,
            profileImage: profileImage as string,
          },
          createdAt: singlePost.post.createdAt as string,
          visibility: singlePost.post.visibility,
          sharedPostId: singlePost.post.sharedPostId
        };

        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
};

export default FeedPage;

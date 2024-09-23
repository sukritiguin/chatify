"use client";
import { useQuery } from "convex/react";
import Post from "./components/Post";
import PostCreator from "./components/PostCreator";
import { api } from "../../../convex/_generated/api";

interface PostDataInterface {
  id: string;
  content: string;
  images?: string[];
  user: {
    name: string;
    profileImage: string;
  };
  createdAt: string;
  visibility: "public" | "connections" | "private";
}

const FeedPage = () => {
  const allPosts = useQuery(api.queries.getAllPosts);

  if (!allPosts) return <></>;

  return (
    <div className="">
      <PostCreator />
      {allPosts.map((singlePost) => {
        const name = singlePost.profile?.name;
        const profileImage = singlePost.profile?.profilePhoto;
        const post: PostDataInterface = {
          id: singlePost.post._id,
          content: singlePost.post.content,
          images: singlePost.post.media,
          user: {
            name: name as string,
            profileImage: profileImage as string,
          },
          createdAt: singlePost.post.createdAt as string,
          visibility: singlePost.post.visibility,
        };

        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
};

export default FeedPage;

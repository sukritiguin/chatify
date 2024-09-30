"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Post from "../components/Post";

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

export const PostPage = ({ params }: { params: { postId: string } }) => {
  const post = useQuery(api.queries.getPostById, {
    postId: params.postId as Id<"posts">,
  });

  console.log(post);

  const profile = useQuery(api.queries.getUserProfileById, {
    userId: post?.userId as Id<"users">,
  });

  const organization = useQuery(api.queries.getOrganizationByUserId, {
    userId: post?.userId as Id<"users">,
  });

  const postData: PostDataInterface = {
    id: post?._id as Id<"posts">,
    content: post?.content as string,
    images: post?.media,
    user: profile
      ? {
          userId: profile.userId as Id<"users">,
          name: profile.name as string,
          profileImage: profile.profilePhoto as string,
        }
      : {
          userId: organization?.adminUserId as Id<"users">,
          name: organization?.name as string,
          profileImage: organization?.logo as string,
        },
    createdAt: (post?.createdAt
      ? post.createdAt
      : new Date().toString()) as string,
    visibility: post?.visibility === undefined ? "public" : post?.visibility,
    sharedPostId: post?.sharedPostId,
  };

  return <Post post={postData} />;
};

export default PostPage;

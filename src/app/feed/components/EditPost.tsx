/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const EditPost = ({
  isOpen,
  setOpen,
  postId,
}: {
  isOpen: boolean;
  setOpen: any;
  postId: Id<"posts">;
}) => {
  const [visibility, setVisibility] = useState<
    "public" | "connections" | "private"
  >();
  const [content, setContent] = useState("");

  // This is for edit post section
  const [userData, setUserData] = useState<{
    name: string;
    avatar: string;
  }>({
    name: "",
    avatar: "",
  });

  const currentUserProfile = useQuery(api.queries.getUserProfile);
  const currentOrganization = useQuery(api.queries.getOrganization);

  const currentPost = useQuery(api.queries.getPostById, { postId: postId });

  const updatePost = useMutation(api.queries.updatePost);

  useEffect(() => {
    setVisibility(
      currentPost?.visibility as "public" | "connections" | "private"
    );
    setContent(currentPost?.content as string);
  }, [currentPost]);

  useEffect(() => {
    if (currentUserProfile) {
      setUserData({
        name: currentUserProfile.name,
        avatar: currentUserProfile.profilePhoto || "",
      });
    } else if (currentOrganization) {
      setUserData({
        name: currentOrganization.name,
        avatar: currentOrganization.logo || "",
      });
    }
  }, [currentUserProfile, currentOrganization]);

  const handlePostEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updatePost({
      postId: postId,
      data: {
        visibility: visibility === undefined ? "public" : visibility,
        content: content,
      },
    });

    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {/* Dialog for creating a post */}
      <DialogContent className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Create a Post
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Share your thoughts and updates with your network.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePostEdit} className="space-y-4">
          <div className="flex items-center mb-4">
            <Image
              src={userData.avatar} // Replace with actual user profile image
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500 mr-3"
              height={36}
              width={36}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {userData.name}
              </span>
              {/* Replace with actual user name */}
              <div className="flex space-x-2 items-center">
                <Select
                  value={visibility}
                  onValueChange={(value) =>
                    setVisibility(value as "public" | "connections" | "private")
                  }
                >
                  <SelectTrigger className="text-gray-700 font-semibold">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="connections">
                      Connections Only
                    </SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-800"
            placeholder="What do you want to talk about?"
            required
          />

          <Button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
          >
            Edit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

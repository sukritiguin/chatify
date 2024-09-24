"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineFileImage } from "react-icons/ai";
import { MdPermMedia } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary.utility";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Loader from "@/components/ui/Loader";
// import { Dialog as  } from "@radix-ui/react-dialog"; // Import for extra images modal

const PostCreator: React.FC = () => {
  const [content, setContent] = useState<string>(""); // State for post content
  const [images, setImages] = useState<File[]>([]); // State for uploaded images
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<
    "public" | "connections" | "private"
  >("public"); // State for post visibility
  const [extraImagesDialogOpen, setExtraImagesDialogOpen] =
    useState<boolean>(false); // Modal state for extra images
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    name: string;
    avatar: string;
  }>({
    name: "",
    avatar: "",
  });

  const currentUserProfile = useQuery(api.queries.getUserProfile);
  const currentOrganization = useQuery(api.queries.getOrganization);

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

  const insertPost = useMutation(api.queries.insertPost);

  // Function to handle form submission
  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) {
      toast.error("Content cannot be empty!"); // Notify user
      return;
    }

    setLoading(true);

    // Handle the post creation logic
    console.log("Post Content:", content);
    console.log("Selected Visibility:", visibility);
    console.log("Uploaded Images:", images);
    toast.success("Post created successfully!");
    setContent("");
    setImages([]); // Reset images

    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imageUrl = await uploadImageToCloudinary(images[i]);
      console.log("Uploaded image urls:", i, imageUrl);
      uploadedImageUrls.push(imageUrl as string);
    }

    setImagesUrl(uploadedImageUrls);

    const data = {
      content: content,
      media: imagesUrl,
      visibility: visibility,
    };

    await insertPost({ data: data });

    console.log("Uploaded Images Urls:", imagesUrl);
    toast.success("Post created successfully!");

    setLoading(false);
  };

  // Function to handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") // Check if the file is an image
      );

      // Check total images after adding new selections
      const totalImages = images.length + selectedFiles.length;

      if (totalImages > 15) {
        // Show toast notification if trying to exceed 15 images
        toast.error(
          "You can only upload up to 15 images. The first 15 will be selected."
        );
      }

      // Take only the first 15 images
      const newImages = selectedFiles.slice(0, 15 - images.length);

      // Update state with the combined images
      setImages((prev) => [...prev.slice(0, 15), ...newImages]);
    }

    setLoading(false);
  };

  // Function to remove an uploaded image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index)); // Remove image by index
  };

  if (loading) return <Loader />;

  return (
    <div className="flex items-center justify-center p-6 bg-gray-100">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center">
            <AiOutlineFileImage className="mr-2" />
            Create a Post
          </Button>
        </DialogTrigger>

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
          <form onSubmit={handlePostSubmit} className="space-y-4">
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
                      setVisibility(
                        value as "public" | "connections" | "private"
                      )
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
                  <label
                    htmlFor="file-upload"
                    className="text-3xl text-gray-700 hover:cursor-pointer"
                  >
                    <MdPermMedia />
                  </label>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    multiple
                    onChange={handleImageChange}
                  />
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

            {/* Image upload preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.slice(0, 5).map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      height={100}
                      width={100}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-red-500 p-1 hover:text-red-600"
                      onClick={() => removeImage(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                {/* Show + button if there are more than 6 images */}
                {images.length > 5 && (
                  <Dialog
                    open={extraImagesDialogOpen}
                    onOpenChange={setExtraImagesDialogOpen}
                  >
                    {/* Only the button acts as the DialogTrigger */}
                    <DialogTrigger asChild>
                      <div className="relative">
                        <div className="relative w-full h-24 rounded-lg overflow-hidden">
                          {/* Background image with blur */}
                          <div
                            className="absolute inset-0 bg-cover bg-center filter blur-sm"
                            style={{
                              backgroundImage: `url(${URL.createObjectURL(images[5])})`,
                            }}
                          />

                          {/* Text on top, not affected by blur */}
                          <button
                            className="relative w-full h-full flex items-center justify-center font-bold text-5xl text-gray-900 z-10"
                            type="button"
                            onClick={() => setExtraImagesDialogOpen(true)}
                          >
                            +{images.length - 5}
                          </button>
                        </div>
                      </div>
                    </DialogTrigger>

                    {/* The modal and content */}
                    <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                      <DialogTitle className="text-xl font-semibold mb-4 text-gray-700">
                        Additional Images
                      </DialogTitle>
                      <div className="grid grid-cols-3 gap-4">
                        {images.slice(6).map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              height={128}
                              width={128}
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 text-red-500 p-1 hover:text-red-600"
                              onClick={() => removeImage(6 + index)} // Adjust index for remaining images
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => setExtraImagesDialogOpen(false)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500"
                      >
                        Close
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
            >
              Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Extra images modal */}
    </div>
  );
};

export default PostCreator;

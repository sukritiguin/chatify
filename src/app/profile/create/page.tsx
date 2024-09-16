"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from "@/lib/cloudinary.utility";

const CreateProfile = () => {
  const [profile, setProfile] = useState({
    coverPhoto: "",
    profilePhoto: "",
    bio: "",
    educations: [{ institute: "", course: "", start: "", end: "", story: "" }],
    experiences: [
      { company: "", designation: "", type: "", start: "", end: "" },
    ],
    skills: [{ skill: "", level: "Beginner" }],
    socials: { linkedIn: "", github: "", twitter: "" },
  });

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const handleFileUpload = async (
    file: File,
    type: "coverPhoto" | "profilePhoto"
  ) => {
    if (!file) return;

    const publicUrl = await uploadImageToCloudinary(file);

    setProfile((prevProfile) => ({
      ...prevProfile,
      [type]: publicUrl, // Save the secure URL from Cloudinary
    }));

    if (type === "coverPhoto") {
      setUploadingCover(false);
    } else {
      setUploadingProfile(false);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingCover(true);
      handleFileUpload(file, "coverPhoto");
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingProfile(true);
      handleFileUpload(file, "profilePhoto");
    }
  };

  const handleSubmit = () => {
    // Submit the profile with the image URLs
    console.log(profile);
    // Send profile to backend
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        <Card className="w-full h-full p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>
              Create a profile to showcase your information
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 space-y-5 pb-0">
            <form
              className="space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleSubmit();
              }}
            >
              <div className="flex flex-col items-center justify-center p-5 border border-gray-300 rounded-lg bg-gray-100 shadow-md max-w-lg">
                <label className="text-xl mb-2">Upload Cover Photo</label>
                <Input
                  type="file"
                  onChange={handleCoverPhotoChange}
                  className="mb-3"
                />
                {uploadingCover && (
                  <p className="text-blue-600 italic mb-2">
                    Uploading cover photo...
                  </p>
                )}
                {profile.coverPhoto && (
                  <div className="mt-3">
                    <Image
                      src={profile.coverPhoto}
                      alt="Cover"
                      width={600} // Adjust width for better visibility
                      height={300} // Adjust height for better visibility
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                <label className="text-xl mb-2">Upload Profile Photo</label>
                <Input
                  type="file"
                  onChange={handleProfilePhotoChange}
                  className="mb-3"
                />
                {uploadingProfile && (
                  <p className="text-blue-600 italic mb-2">
                    Uploading profile photo...
                  </p>
                )}
                {profile.profilePhoto && (
                  <div className="mt-3">
                    <Image
                      src={profile.profilePhoto}
                      alt="Profile"
                      width={100} // Adjusted width for visibility
                      height={100} // Adjusted height for visibility
                      className="object-cover rounded-full border-2 border-gray-300" // Added border and rounded for a profile look
                    />
                  </div>
                )}
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;

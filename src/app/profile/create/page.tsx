/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from "@/lib/cloudinary.utility";
import { Label } from "@/components/ui/label";
import {
  FaPlus,
  FaTrash,
  FaLinkedin,
  FaTwitterSquare,
  FaGithubSquare,
} from "react-icons/fa"; // Importing icons for add and remove
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EducationCard from "./components/EducationCard";
import EducationForm from "./components/EducationForm";
import ExperienceCard from "./components/ExperienceCard";
import ExperienceForm from "./components/ExperienceForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Education,
  Experience,
  Profile,
  Skill,
} from "../../../../types/profile.interface";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

type RemoveEducationType = (index: number) => void;
type HandleEducationChangeType = (
  index: number,
  field: keyof Education,
  value: string
) => void;
type HandleExperienceChangeType = (
  index: number,
  field: keyof Experience,
  value: string
) => void;

const CreateProfile = () => {
  const router = useRouter(); // Get router instance
  const [profile, setProfile] = useState<Profile>({
    name: "",
    coverPhoto: "",
    profilePhoto: "",
    bio: "",
    educations: [{ institute: "", course: "", start: "", end: "", story: "" }],
    experiences: [
      { company: "", designation: "", type: "", start: "", end: "" },
    ],
    skills: [{ skill: "", level: "" }],
    socials: { linkedIn: "", github: "", twitter: "" },
  });

  const insertProfile = useMutation(api.queries.insertProfile);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const [educationFilled, setEducationFilled] = useState(false);
  const [experienceFilled, setExperienceFilled] = useState(false);

  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch user profile with proper typing
  const userProfile = useQuery(api.queries.getUserProfile);

  useEffect(() => {
    // Check the profile data after it has been fetched
    if (userProfile) {
      router.push("/profile"); // Redirect if profile exists
    } else {
      setLoading(false); // Stop loading if there is no profile
    }
  }, [userProfile, router]);

  // Show loading spinner or message while fetching profile
  if (loading) {
    return <Loader size="large" color="#4A90E2" />;
  }

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

  const handleSubmit = async () => {
    // Submit the profile with the image URLs
    console.log(profile);
    // Send profile to backend
    try {
      // Call the mutation with userId and profileData
      const newProfileId = await insertProfile({
        data: profile,
      });

      console.log("New Profile ID:", newProfileId);
      router.push("/profile");
    } catch (error) {
      console.error("Error inserting profile:", error);
    }
  };

  const handleEducationChange: HandleEducationChangeType = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducations: Education[] = profile.educations
      ? [...profile.educations]
      : [];
    updatedEducations[index][field] = value;
    setProfile((prevProfile) => ({
      ...prevProfile,
      educations: updatedEducations,
    }));

    // Check if all fields are filled to enable the "Add Education" button
    const isFilled =
      updatedEducations[index].institute &&
      updatedEducations[index].course &&
      updatedEducations[index].start &&
      updatedEducations[index].end;
    setEducationFilled(!!isFilled);
  };

  // Update the handleExperienceChange function to set experienceFilled
  const handleExperienceChange: HandleExperienceChangeType = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updatedExperiences: Experience[] = profile.experiences
      ? [...profile.experiences]
      : [];
    updatedExperiences[index][field] = value as any;
    setProfile((prevProfile) => ({
      ...prevProfile,
      experiences: updatedExperiences,
    }));

    // Check if all fields are filled to enable the "Add Experience" button
    const isFilled =
      updatedExperiences[index].company &&
      updatedExperiences[index].designation &&
      updatedExperiences[index].start &&
      updatedExperiences[index].end;
    setExperienceFilled(!!isFilled);
  };

  const addEducation = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      educations: [
        ...(prevProfile.educations || []),
        { institute: "", course: "", start: "", end: "", story: "" },
      ],
    }));
    setEducationFilled(false); // Disable the button until new fields are filled
  };

  const removeEducation: RemoveEducationType = (index: number) => {
    if (profile.educations) {
      const updatedEducations = profile.educations.filter(
        (_, i) => i !== index
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        educations: updatedEducations,
      }));
    }
  };

  const addExperience = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      experiences: [
        ...(prevProfile.experiences || []),
        { company: "", designation: "", type: "", start: "", end: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    if (profile.experiences) {
      const updatedExperiences = profile.experiences.filter(
        (_, i) => i !== index
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        experiences: updatedExperiences,
      }));
    }
  };

  const addSkill = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: [...(prevProfile.skills || []), { skill: "", level: "Beginner" }],
    }));
  };

  const removeSkill = (index: number) => {
    if (profile.skills) {
      const updatedSkills = profile.skills.filter((_, i) => i !== index);
      setProfile((prevProfile) => ({ ...prevProfile, skills: updatedSkills }));
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#5C3B58] p-4">
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
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleSubmit();
              }}
            >
              {/* Cover Photo Upload */}
              <div className="flex flex-col">
                <Label className="my-2">Enter your name, e.g Jon Doe</Label>
                <Input
                  type="text"
                  className="mb-3"
                  placeholder="Enter your name, e.g Jon Doe"
                  required
                  onChange={(event) => {
                    setProfile((prevProfile) => ({
                      ...prevProfile,
                      name: event.target.value,
                    }));
                  }}
                />
                <Label className="my-2">Upload your banner</Label>
                <Input
                  type="file"
                  onChange={handleCoverPhotoChange}
                  className="mb-3"
                  placeholder="Upload cover photo"
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
                      width={600}
                      height={300}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Profile Photo Upload */}
              <div className="flex flex-col">
                <Label className="my-2">Upload your photo</Label>
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
                      width={100}
                      height={100}
                      className="object-cover border-2 border-gray-300 rounded-full"
                    />
                  </div>
                )}
              </div>

              {/* Bio Input */}
              <div>
                <Label className="my-2">Enter your bio</Label>
                <Input
                  placeholder="Life is a circle of sadness and happiness"
                  type="text"
                  onChange={(event) => {
                    setProfile((prevProfile) => ({
                      ...prevProfile,
                      bio: event.target.value,
                    }));
                  }}
                />
              </div>

              {/* Educations Section */}

              <div>
                <Label className="my-2">Your Education</Label>
                {profile.educations &&
                  profile.educations.length > 0 &&
                  profile.educations.map((education, index) => (
                    <div key={index} className="mb-4">
                      {/* Render as a card if it's a filled education */}
                      {education.institute &&
                      education.course &&
                      education.start &&
                      education.end ? (
                        <EducationCard
                          education={education}
                          index={index}
                          removeEducation={removeEducation}
                        />
                      ) : (
                        // Render the form to fill the education details
                        <EducationForm
                          education={education}
                          index={index}
                          handleEducationChange={handleEducationChange}
                        />
                      )}
                    </div>
                  ))}
                <Button
                  type="button"
                  className="flex items-center text-blue-600"
                  onClick={addEducation}
                  disabled={!educationFilled}
                >
                  <FaPlus className="mr-2" />
                  Add Education
                </Button>
              </div>

              {/* Experiences Section */}
              {/* <div>
                <Label className="my-2">Your Experiences</Label>
                {profile.experiences.map((experience, index) => (
                  <div key={index} className="mb-4">
                    <Input
                      className="my-1"
                      placeholder="Company"
                      value={experience.company}
                      onChange={(e) => {
                        const updatedExperiences = [...profile.experiences];
                        updatedExperiences[index].company = e.target.value;
                        setProfile({
                          ...profile,
                          experiences: updatedExperiences,
                        });
                      }}
                    />
                    <Input
                      className="my-1"
                      placeholder="Designation"
                      value={experience.designation}
                      onChange={(e) => {
                        const updatedExperiences = [...profile.experiences];
                        updatedExperiences[index].designation = e.target.value;
                        setProfile({
                          ...profile,
                          experiences: updatedExperiences,
                        });
                      }}
                    />
                    <Select
                      onValueChange={(value) => {
                        const updatedExperiences = [...profile.experiences];
                        updatedExperiences[index].type = value;
                        setProfile({
                          ...profile,
                          experiences: updatedExperiences,
                        });
                      }}
                      value={experience.type}
                    >
                      <SelectTrigger className="w-full my-1">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fulltime">Full Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="apprenticeship">
                          Apprenticeship
                        </SelectItem>
                        <SelectItem value="part time">Part Time</SelectItem>
                        <SelectItem value="WFH">
                          Work From Home (WFH)
                        </SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex space-x-2">
                      <Input
                        className="my-1"
                        placeholder="Start Date"
                        type="date"
                        value={experience.start}
                        onChange={(e) => {
                          const date = new Date(e.target.value); // Convert to Date object
                          const formattedDate = date
                            .toISOString()
                            .split("T")[0]; // Convert to YYYY-MM-DD format
                          const updatedExperiences = [...profile.experiences];
                          updatedExperiences[index].start = formattedDate;
                          setProfile({
                            ...profile,
                            experiences: updatedExperiences,
                          });
                        }}
                      />
                      <Input
                        className="my-1"
                        placeholder="End Date"
                        type="date"
                        value={experience.end}
                        onChange={(e) => {
                          const date = new Date(e.target.value); // Convert to Date object
                          const formattedDate = date
                            .toISOString()
                            .split("T")[0]; // Convert to YYYY-MM-DD format
                          const updatedExperiences = [...profile.experiences];
                          updatedExperiences[index].end = formattedDate;
                          setProfile({
                            ...profile,
                            experiences: updatedExperiences,
                          });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => removeExperience(index)}
                    >
                      <FaTrash className="inline-block mr-1" />
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center text-blue-600"
                  onClick={addExperience}
                >
                  <FaPlus className="mr-2" />
                  Add Experience
                </button>
              </div> */}
              <div>
                <Label className="my-2">Your Experiences</Label>
                {profile.experiences &&
                  profile.experiences.length > 0 &&
                  profile.experiences.map((experience, index) => (
                    <div key={index} className="mb-4">
                      {experience.company &&
                      experience.designation &&
                      experience.start &&
                      experience.end ? (
                        // Render experience as a card if all fields are filled
                        <ExperienceCard
                          experience={experience}
                          index={index}
                          removeExperience={removeExperience}
                        />
                      ) : (
                        // Render the form to fill the experience details
                        <ExperienceForm
                          experience={experience}
                          index={index}
                          handleExperienceChange={handleExperienceChange}
                        />
                      )}
                    </div>
                  ))}
                <Button
                  type="button"
                  className="flex items-center text-blue-600"
                  onClick={addExperience}
                  disabled={!experienceFilled}
                >
                  <FaPlus className="mr-2" />
                  Add Experience
                </Button>
              </div>

              {/* Skills Section */}
              <div>
                <Label className="my-2">Your Skills</Label>
                {profile.skills &&
                  profile.skills.length > 0 &&
                  profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="mb-4 flex items-center space-x-2"
                    >
                      <Input
                        placeholder="Skill"
                        value={skill.skill}
                        onChange={(e) => {
                          const updatedSkills = [...(profile.skills || [])];
                          updatedSkills[index].skill = e.target.value;
                          setProfile({ ...profile, skills: updatedSkills });
                        }}
                      />
                      <Select
                        onValueChange={(
                          value:
                            | "Beginner"
                            | "Intermediate"
                            | "Advanced"
                            | "Proficient"
                            | "Expert"
                            | "Master"
                            | ""
                        ) => {
                          const updatedSkills: Skill[] = [
                            ...(profile.skills || []),
                          ];
                          updatedSkills[index].level = value;
                          setProfile({
                            ...profile,
                            skills: updatedSkills,
                          });
                        }}
                        value={skill.level}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent defaultValue={"Begineer"}>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Proficient">Proficient</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => removeSkill(index)}
                      >
                        <FaTrash className="inline-block mr-1" />
                        Remove
                      </button>
                    </div>
                  ))}
                <button
                  type="button"
                  className="flex items-center text-blue-600"
                  onClick={addSkill}
                >
                  <FaPlus className="mr-2" />
                  Add Skill
                </button>
              </div>

              {/* Socials Section */}
              <div>
                <Label className="my-2">Your Social Links</Label>
                <div className="mb-4 flex items-center space-x-2">
                  <FaLinkedin />
                  <Input
                    className="my-1"
                    placeholder="LinkedIn"
                    value={
                      profile && profile.socials ? profile.socials.linkedIn : ""
                    }
                    onChange={(e) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        socials: {
                          ...prevProfile.socials,
                          linkedIn: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="mb-4 flex items-center space-x-2">
                  <FaGithubSquare />
                  <Input
                    className="my-1"
                    placeholder="GitHub"
                    value={
                      profile && profile.socials ? profile.socials.github : ""
                    }
                    onChange={(e) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        socials: {
                          ...prevProfile.socials,
                          github: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="mb-4 flex items-center space-x-2">
                  <FaTwitterSquare />
                  <Input
                    className="my-1"
                    placeholder="Twitter"
                    value={
                      profile && profile.socials ? profile.socials.twitter : ""
                    }
                    onChange={(e) => {
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        socials: {
                          ...prevProfile.socials,
                          twitter: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4 w-full">
                Create Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfile;

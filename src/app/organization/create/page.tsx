/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   FaBuilding,
//   FaInfoCircle,
//   FaGlobe,
//   FaMapMarkerAlt,
//   FaIndustry,
//   FaCalendarAlt,
//   FaCamera,
//   FaCrop,
// } from "react-icons/fa";
// import { getCroppedImg } from "@/lib/cropImage";
// import { useCallback, useState } from "react";
// import Cropper from "react-easy-crop";
// import Modal from "@/components/ui/Modal"; // Import your modal component

// const CreateOrganization = () => {
//   const [logoSrc, setLogoSrc] = useState<string | null>(null); // Logo image source
//   const [croppedArea, setCroppedArea] = useState(null);
//   const [croppedLogo, setCroppedLogo] = useState<string | null>(null); // Cropped logo preview
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

//   // Handle logo upload
//   const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         setLogoSrc(reader.result as string);
//       };
//     }
//   };

//   // When the crop is completed
//   const onCropComplete = useCallback(async () => {
//     try {
//       const croppedImage = await getCroppedImg(logoSrc as string, croppedArea);
//       setCroppedLogo(croppedImage);
//       setIsModalOpen(false); // Close the modal after cropping
//     } catch (e) {
//       console.error(e);
//     }
//   }, [croppedArea]);

//   return (
//     <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-50 via-gray-100 to-purple-50 text-gray-900 p-6">
//       <Card className="w-full max-w-lg shadow-lg border border-purple-200 rounded-lg">
//         <CardHeader className="text-center bg-purple-100 rounded-t-lg py-4">
//           <CardTitle className="text-2xl font-bold text-purple-900">
//             Register Your Organization
//           </CardTitle>
//           <CardDescription className="text-purple-700">
//             We are excited to have you on board!
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6 p-6">
//           {/* Organization Name */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="name"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaBuilding className="mr-2 text-purple-700" /> Organization Name
//             </Label>
//             <Input
//               type="text"
//               id="name"
//               placeholder="e.g. Amazon"
//               required
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Description */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="description"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaInfoCircle className="mr-2 text-purple-700" /> Description
//             </Label>
//             <Textarea
//               id="description"
//               placeholder="Short description of your organization"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Website URL */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="website"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaGlobe className="mr-2 text-purple-700" /> Website URL
//             </Label>
//             <Input
//               type="url"
//               id="website"
//               placeholder="https://www.example.com"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Logo Upload */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="logo"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaCamera className="mr-2 text-purple-700" /> Upload Logo (96x96)
//             </Label>
//             <Input
//               type="file"
//               accept="image/*"
//               id="logo"
//               onChange={onLogoUpload}
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Button to Open Cropper Modal */}
//           {logoSrc && (
//             <Button
//               onClick={() => setIsModalOpen(true)}
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//             >
//               Crop Logo <FaCrop className="ml-2" />
//             </Button>
//           )}

//           {/* Cropped Logo Preview */}
//           {croppedLogo && (
//             <div className="mt-4">
//               <Label>Cropped Logo Preview:</Label>
//               <img
//                 src={croppedLogo}
//                 alt="Cropped Logo"
//                 className="w-24 h-24 rounded-full"
//               />
//             </div>
//           )}

//           {/* Cover Photo URL */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="coverPhoto"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaCamera className="mr-2 text-purple-700" /> Cover Photo URL
//             </Label>
//             <Input
//               type="url"
//               id="coverPhoto"
//               placeholder="https://www.coverphoto-url.com"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Address */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="address"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaMapMarkerAlt className="mr-2 text-purple-700" /> Address
//             </Label>
//             <Input
//               type="text"
//               id="address"
//               placeholder="e.g. 123 Street, City, Country"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Industry */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="industry"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaIndustry className="mr-2 text-purple-700" /> Industry
//             </Label>
//             <Input
//               type="text"
//               id="industry"
//               placeholder="e.g. Technology, Education, Healthcare"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Established Year */}
//           <div className="flex flex-col space-y-2">
//             <Label
//               htmlFor="established"
//               className="text-lg font-semibold flex items-center"
//             >
//               <FaCalendarAlt className="mr-2 text-purple-700" /> Established
//               Year
//             </Label>
//             <Input
//               type="number"
//               id="established"
//               placeholder="e.g. 1999"
//               className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Submit Button */}
//           <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
//             Register Organization
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Modal for Cropping Logo */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <div className="relative h-64 w-64 bg-gray-200">
//           <Cropper
//             image={logoSrc}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             onCropChange={setCrop}
//             onZoomChange={setZoom}
//             onCropComplete={(_, croppedAreaPixels) =>
//               setCroppedArea(croppedAreaPixels)
//             }
//           />
//         </div>
//         <Button onClick={onCropComplete} className="mt-4 bg-purple-600 text-white">
//           Crop & Save Logo
//         </Button>
//       </Modal>
//     </div>
//   );
// };

// export default CreateOrganization;

// CreateOrganization.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FaBuilding,
  FaInfoCircle,
  FaGlobe,
  FaMapMarkerAlt,
  FaIndustry,
  FaCalendarAlt,
  FaCamera,
} from "react-icons/fa";
import ImageCropper from "./components/ImageCropper"; // Adjust the import based on your file structure
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary.utility";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

const convertBlobUrlToFile = async (
  blobUrl: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(blobUrl); // Fetch the Blob data from the URL
  const blob = await response.blob(); // Get the Blob from the response
  const file = new File([blob], fileName, { type: blob.type }); // Convert Blob to File
  return file;
};

const CreateOrganization = () => {
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [establishedYear, setEstablishedYear] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const insertOrganization = useMutation(api.queries.insertOrganization);
  const existingOrganization = useQuery(api.queries.getOrganization);

  const router = useRouter();

  const handleSubmit = async () => {
    // TODO: Write Handle Submit Code Here..

    const logoBolb = await convertBlobUrlToFile(logoImage!, "logo.png");
    const bannerBolb = await convertBlobUrlToFile(bannerImage!, "banner.png");

    const logoPublicUrl = await uploadImageToCloudinary(logoBolb);
    const bannerPublicUrl = await uploadImageToCloudinary(bannerBolb);

    console.log({
      logo: logoImage,
      banner: bannerImage,
      logoBolb,
      bannerBolb,
      logoPublicUrl,
      bannerPublicUrl,
    });

    const data = {
      name: name, // Organization name (required)
      description: description, // Optional description of the organization
      website: website, // Optional website URL
      logo: logoPublicUrl, // Optional logo of the organization
      banner: bannerPublicUrl, // Optional cover photo for the organization
      address: address, // Optional address of the organization
      industry: industry, // Optional industry the organization belongs to
      established: establishedYear, // Optional year of establishment
    };

    try {
      setLoading(true);
      await insertOrganization({ data });
      router.push("/organization");
      setLoading(false);
    } catch {
      console.log("Error inserting organization");
    }
  };

  const isUserRegistered = useQuery(api.queries.getUserRegistration);

  if (isUserRegistered === undefined) {
    return <Loader />;
  }

  if (isUserRegistered) {
    if (isUserRegistered.type === "profile") {
      router.push("/profile");
    } else {
      router.push("/organization");
    }
  }

  if (existingOrganization !== null && existingOrganization !== undefined) {
    router.push("/organization");
  }

  if (existingOrganization === undefined || loading) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-50 via-gray-100 to-purple-50 text-gray-900 p-6">
      <Card className="w-full max-w-lg shadow-lg border border-purple-200 rounded-lg">
        <CardHeader className="text-center bg-purple-100 rounded-t-lg py-4">
          <CardTitle className="text-2xl font-bold text-purple-900">
            Register Your Organization
          </CardTitle>
          <CardDescription className="text-purple-700">
            We are excited to have you on board!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Organization Name */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="name"
              className="text-lg font-semibold flex items-center"
            >
              <FaBuilding className="mr-2 text-purple-700" /> Organization Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="e.g. Amazon"
              required
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => {
                setName(event.target.value);
              }}
              value={name}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="description"
              className="text-lg font-semibold flex items-center"
            >
              <FaInfoCircle className="mr-2 text-purple-700" /> Description
            </Label>
            <Textarea
              id="description"
              placeholder="Short description of your organization"
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </div>

          {/* Website URL */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="website"
              className="text-lg font-semibold flex items-center"
            >
              <FaGlobe className="mr-2 text-purple-700" /> Website URL
            </Label>
            <Input
              type="url"
              id="website"
              placeholder="https://www.example.com"
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => {
                setWebsite(event.target.value);
              }}
              value={website}
            />
          </div>

          {/* Logo Cropper */}

          <ImageCropper
            aspect={1}
            onCropComplete={(croppedImage) => setLogoImage(croppedImage)}
            icon={<FaCamera />} // Replace with your icon component
            label="Upload Logo"
          />

          {/* Cropped Logo Preview */}
          {logoImage && (
            <div className="mt-4">
              <Image
                src={logoImage}
                alt="Cropped Logo"
                className="w-24 h-24 rounded-full"
                height={400}
                width={400}
              />
            </div>
          )}

          {/* Banner Cropper */}
          <ImageCropper
            aspect={4 / 1}
            onCropComplete={(croppedImage) => setBannerImage(croppedImage)}
            icon={<FaCamera />} // Replace with your icon component
            label="Upload Banner"
          />

          {/* Cropped Banner Preview */}
          {bannerImage && (
            <div className="mt-4">
              <Image
                src={bannerImage}
                alt="Cropped Banner"
                className="w-full h-32 object-cover rounded"
                height={900}
                width={1600}
              />
            </div>
          )}

          {/* Address */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="address"
              className="text-lg font-semibold flex items-center"
            >
              <FaMapMarkerAlt className="mr-2 text-purple-700" /> Address
            </Label>
            <Input
              type="text"
              id="address"
              placeholder="e.g. 123 Street, City, Country"
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              value={address}
            />
          </div>

          {/* Industry */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="industry"
              className="text-lg font-semibold flex items-center"
            >
              <FaIndustry className="mr-2 text-purple-700" /> Industry
            </Label>
            <Input
              type="text"
              id="industry"
              placeholder="e.g. Technology, Education, Healthcare"
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => {
                setIndustry(event.target.value);
              }}
              value={industry}
            />
          </div>

          {/* Established Year */}
          <div className="flex flex-col space-y-2">
            <Label
              htmlFor="established"
              className="text-lg font-semibold flex items-center"
            >
              <FaCalendarAlt className="mr-2 text-purple-700" /> Established
              Year
            </Label>
            <Input
              type="number"
              id="established"
              placeholder="e.g. 1999"
              className="border-purple-400 focus:ring-purple-500 focus:border-purple-500"
              onChange={(event) => {
                setEstablishedYear(event.target.value);
              }}
              value={establishedYear}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-purple-600 text-white"
            onClick={handleSubmit}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganization;

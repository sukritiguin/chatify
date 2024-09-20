/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage"; // Adjust this import based on your file structure
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal"; // Import your modal component
import { Input } from "@/components/ui/input"; // Import the Input component from Shadcn UI
import { Label } from "@radix-ui/react-label";

interface ImageCropperProps {
  aspect: number; // Aspect ratio (e.g., 1 for square, 16/9 for banner)
  onCropComplete: (croppedImage: string) => void; // Callback function to get cropped image
  icon?: React.ReactNode; // Optional icon prop
  label?: string; // Optional label prop
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  aspect,
  onCropComplete: onCropCompleteProp, // Renamed here to avoid conflict
  icon,
  label,
}) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(null); // Image source
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Handle image upload
  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setLogoSrc(reader.result as string);
        setIsModalOpen(true); // Open modal on upload
      };
    }
  };

  // When the crop is completed
  const handleCropComplete = useCallback(async () => {
    if (!logoSrc || !croppedArea) return;

    try {
      const croppedImage = await getCroppedImg(logoSrc, croppedArea);
      onCropCompleteProp(croppedImage); // Pass the cropped image back
      setIsModalOpen(false); // Close the modal
    } catch (e) {
      console.error(e);
    }
  }, [logoSrc, croppedArea, onCropCompleteProp]);

  return (
    <div>
      <div className="mb-4">
        {/* Input label */}
        {label && (
          <Label
            htmlFor="website"
            className="text-lg font-semibold flex items-center mb-2"
          >
            <p className="text-purple-700 ">{icon}</p>{" "}
            <p className="ml-2">{label}</p>
          </Label>
        )}

        {/* Input with optional icon */}
        <div className="relative">
          {icon && (
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300">
              {icon}
            </span>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className={`border-purple-400 focus:ring-purple-500 focus:border-purple-500 pl-${icon ? 8 : 4} mb-4`} // Adjust padding based on icon presence
          />
        </div>
      </div>

      {/* Modal for cropping image */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="relative h-64 w-64 bg-gray-200">
            <Cropper
              image={logoSrc!}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedArea(croppedAreaPixels)
              }
            />
          </div>
          <Button
            onClick={handleCropComplete} // Updated to use new function name
            className="mt-4 bg-purple-600 text-white"
          >
            Crop & Save Image
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default ImageCropper;

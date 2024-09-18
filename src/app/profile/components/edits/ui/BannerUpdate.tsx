"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import Loader from "@/components/ui/Loader"; // Import your Loader component
// import Image from "next/image";

import { uploadImageToCloudinary } from "@/lib/cloudinary.utility";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Image from "next/image";


export function BannerUpdate({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateProfileBanner = useMutation(api.queries.updateProfileBanner);

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!banner) return;

    setLoading(true);

    const publicUrl = await uploadImageToCloudinary(banner);

    updateProfileBanner({ coverPhoto: publicUrl });

    setLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Banner</DialogTitle>
          <DialogDescription>
            Upload a banner for your profile. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center">
            <Label htmlFor="banner" className="mb-2">
              Choose a Banner Image
            </Label>
            <Input
              type="file"
              id="banner"
              accept="image/*"
              onChange={handleBannerChange}
            />
            {loading && <Loader />} {/* Show loader when uploading */}
            {bannerUrl && !loading && (
              <Image
              src={bannerUrl}
              alt="Uploaded Banner"
              width={400}
              height={400}/> // Maintain the aspect ratio and cover the entire area
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Save Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

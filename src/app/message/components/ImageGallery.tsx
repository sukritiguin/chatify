import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for next/prev

interface ImageGalleryProps {
  media: string[]; // Array of image URLs
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ media }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < media.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="flex flex-col grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {media.map((src, index) => (
        <Dialog key={index} onOpenChange={() => setSelectedImage(index)}>
          <DialogTrigger asChild>
            <div
              onClick={() => setSelectedImage(index)}
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                width={300}
                height={300}
                className="rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                quality={80}
              />
            </div>
          </DialogTrigger>

          <DialogContent className="w-auto p-4 lg:p-6">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            {selectedImage !== null && (
              <div className="relative flex items-center justify-center">
                {/* Left Navigation Button */}
                {selectedImage > 0 && (
                  <button
                    className="absolute left-0 z-10 p-2 bg-white/70 hover:bg-white rounded-full shadow-lg"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                )}

                {/* Image Display */}
                <Image
                  src={media[selectedImage]}
                  alt="Selected image"
                  width={800}
                  height={600}
                  className="rounded-lg object-contain"
                  quality={100}
                />

                {/* Right Navigation Button */}
                {selectedImage < media.length - 1 && (
                  <button
                    className="absolute right-0 z-10 p-2 bg-white/70 hover:bg-white rounded-full shadow-lg"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

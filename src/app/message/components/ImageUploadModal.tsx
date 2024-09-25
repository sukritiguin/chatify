/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog"; // Ensure you have this in your ShadCN setup
import { AiOutlineClose } from "react-icons/ai";
import { DialogContent } from "@radix-ui/react-dialog";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";

const ImageUploadModal = ({
  isOpen,
  onClose,
  setFiles,
}: {
  isOpen: any;
  onClose: any;
  setFiles: any;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showWarning, setShowWarning] = useState(false); // State for showing warning

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      setShowWarning(true); // Show warning
      return;
    }
    setShowWarning(false); // Hide warning if under limit
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);
  };

  const handleUpload = () => {
    setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]); // Update the parent state with the new files
    onClose(); // Close the modal after upload
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Images</h2>
          <button onClick={onClose}>
            <AiOutlineClose className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
          </button>
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple // Allow multiple file selection
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <p className="text-sm text-gray-600 mt-1">
            You can upload up to 6 images.
          </p>
          {showWarning && (
            <div className="mt-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded-lg">
              You can only upload a maximum of 6 images!
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative border rounded-lg overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)} // Display the image preview
                  alt={file.name}
                  className="w-full h-full object-cover"
                  height={250}
                  width={500}
                />
                <button
                  onClick={() => handleRemoveFile(file)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ${
              selectedFiles.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500"
            }`}
            disabled={selectedFiles.length === 0} // Disable if no files are selected
          >
            Upload
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;

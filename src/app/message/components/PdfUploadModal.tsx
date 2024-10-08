/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Ensure you have this in your ShadCN setup
import { DialogContent } from "@radix-ui/react-dialog";
import { FaTrash } from "react-icons/fa";
import { uploadPdfToCloudinary } from "@/lib/cloudinary.utility"; // Update this utility to handle PDFs
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const PdfUploadModal = ({
  isOpen,
  onClose,
  setFiles,
  files,
  conversationId,
}: {
  isOpen: any;
  onClose: any;
  setFiles: any;
  files: File[];
  conversationId: Id<"conversation">;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showWarning, setShowWarning] = useState(false); // State for showing warning

  const createNewMessage = useMutation(api.queries.createNewMessage);

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      setShowWarning(true); // Show warning
      return;
    }
    setShowWarning(false); // Hide warning if under limit
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);
  };

  const handleUpload = async () => {
    setFiles((prevFiles: any) => [...prevFiles, ...selectedFiles]); // Update the parent state with the new files
    onClose(); // Close the modal after upload

    const uploadedFileUrls = [];

    for (const file of selectedFiles) {
      const url = await uploadPdfToCloudinary(file); // Upload PDFs
      uploadedFileUrls.push(url);
    }

    console.log("Uploaded PDFs: ", {
      files: files,
      selectedFiles: selectedFiles,
      uploadedFileUrls: uploadedFileUrls,
    });

    await createNewMessage({
      media: uploadedFileUrls,
      content: "You sent PDF files",
      conversationId: conversationId,
    });

    setFiles([]);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Upload PDFs</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <input
            type="file"
            accept="application/pdf" // Accept only PDFs
            onChange={handleFileChange}
            multiple // Allow multiple file selection
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <p className="text-sm text-gray-600 mt-1">
            You can upload up to 6 PDF files.
          </p>
          {showWarning && (
            <div className="mt-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 rounded-lg">
              You can only upload a maximum of 6 PDF files!
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 flex justify-between items-center"
              >
                <p className="text-sm text-gray-800">{file.name}</p>
                <button
                  onClick={() => handleRemoveFile(file)}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
            Send
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfUploadModal;

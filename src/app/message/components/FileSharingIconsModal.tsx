import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { FaFilePdf, FaImages } from "react-icons/fa6";

interface FileSharingIconModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  position: {
    left: number;
    top: number;
  };
  setIsUploadImageModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsUploadPdfModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const FileSharingIconModal = ({
  isOpen,
  onClose,
  position,
  setIsUploadImageModalOpen,
  setIsUploadPdfModalOpen,
}: FileSharingIconModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-800 text-gray-50 rounded-lg shadow-lg w-fit mx-0 p-6"
        style={{
          position: "absolute",
          left: position.left + "px",
          top: position.top - 60 + "px",
        }}
      >
        <div className="flex gap-4 text-4xl">
          <FaImages
            className="text-blue-600 hover:cursor-pointer hover:text-blue-500"
            onClick={() => {
              setIsUploadImageModalOpen(true);
              onClose(false);
            }}
          />
          <FaFilePdf
            className="text-red-600 hover:cursor-pointer hover:text-red-500"
            onClick={() => {
              setIsUploadPdfModalOpen(true);
              onClose(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

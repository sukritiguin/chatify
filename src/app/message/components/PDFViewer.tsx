import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
// Core viewer
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PDFViewerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  pdfUrl: string;
}

export const PDFViewer = ({ isOpen, setIsOpen, pdfUrl }: PDFViewerProps) => {
  return (
    <div className="bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[80vh] p-4">
          {/* Wrapper div with proper scrolling */}
          <div className="max-h-[70vh] overflow-auto">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

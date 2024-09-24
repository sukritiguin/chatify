import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdWarning } from "react-icons/md";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmationDialog = ({
  message,
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmationDialogProps) => {
  return (
    <div className="bg-slate-100">
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <MdWarning className="text-red-500 w-6 h-6" />
              <DialogTitle className="text-xl font-bold">
                Confirm Action
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-50 mt-2">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;

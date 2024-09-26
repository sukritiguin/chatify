/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const MessageDialog = ({
  isOpen,
  setOpen,
  messageId,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  messageId: Id<"messages">;
}) => {
  const deleteMessage = useMutation(api.queries.deleteMessage);

  const deleteMessageHandler = async () => {
    await deleteMessage({ messageId: messageId });
  };

  const handleDelete = () => {
    // Logic for deleting the message can be added here
    console.log("Message deleted");
    setOpen(false); // Close the dialog after deletion
    deleteMessageHandler();
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog on cancel
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogTitle className="text-lg font-semibold">
          Confirm Action
        </DialogTitle>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>
        <div className="grid gap-4 py-4">
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Message
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

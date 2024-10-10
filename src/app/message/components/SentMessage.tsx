import { FaCloudDownloadAlt, FaFilePdf, FaUserCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertToTime } from "./ReceivedMessage";
import { useState } from "react";
import { MessageDialog } from "./MessageDialog";
import { IoBanOutline } from "react-icons/io5";
import { IMessage } from "../../../../types/message.interface";
import { ImageGallery } from "./ImageGallery";
import { FaEye } from "react-icons/fa6";
import { PDFViewer } from "./PDFViewer";

export const handleDownload = (pdfUrl: string) => {
  // Create an anchor element
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.target = "_blank"; // Open in a new tab (optional)
  link.download = "your-file-name.pdf"; // Set a default file name for download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up
};

export const SentMessage = ({
  message,
  content,
  messageUserId,
  createdAt,
  receiverId,
  messageId,
}: {
  message: IMessage;
  content: string;
  messageUserId: Id<"users">;
  createdAt: string;
  receiverId: Id<"users">;
  messageId: Id<"messages">;
}) => {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isPDFViewerDialogOpen, setIsPDFViewerDialogOpen] = useState(false);
  const [pdfUrl, setPDFUrl] = useState("");

  let userInfo: {
    name: string;
    avatar: string;
  } = { name: "", avatar: "" };

  const userRegistedAs = useQuery(api.queries.getUserRegistration);

  const isMessageRead = useQuery(api.queries.isMessageRead, {
    messageId: messageId,
    userId: receiverId,
  });

  const profile = useQuery(
    api.queries.getUserProfileById,
    userRegistedAs?.type === "profile"
      ? {
          userId: messageUserId,
        }
      : "skip"
  );

  const organization = useQuery(
    api.queries.getOrganizationByUserId,
    userRegistedAs?.type === "organization"
      ? {
          userId: messageUserId as Id<"users">,
        }
      : "skip"
  );

  if (profile) {
    userInfo = {
      name: profile?.name as string,
      avatar: profile?.profilePhoto as string,
    };
  } else if (organization) {
    userInfo = {
      name: organization?.name as string,
      avatar: organization?.logo as string,
    };
  }

 

  return (
    <div className="flex items-start space-x-2 justify-end">
      <div
        className="flex flex-col bg-gray-200 px-3 py-2 rounded-lg text-sm text-gray-800"
        onContextMenu={(event) => {
          event.preventDefault();
          setIsMessageDialogOpen(true);
        }}
      >
        <span className="font-semibold">{userInfo.name}</span>
        {message.isDeleted === true ? (
          <span className="italic text-gray-500 flex">
            <IoBanOutline className="mt-1 mr-1" />
            <span>You deleted this message</span>
          </span>
        ) : (
          <span>
            {(message.media === undefined || message.media.length === 0) &&
              content}
          </span>
        )}
        {message.media &&
          !message.isDeleted &&
          message.media.length > 0 &&
          !message.media[0].endsWith(".pdf") && (
            <ImageGallery media={message.media} />
          )}

        {message.media &&
          message.media.length > 0 &&
          message.isDeleted === undefined &&
          message.media[0].endsWith(".pdf") &&
          message.media.map((pdfFile) => {
            return (
              <div
                className="flex my-2 bg-gray-100 p-2 rounded-2xl"
                key={pdfFile}
              >
                <FaFilePdf className="text-3xl text-red-600" />
                <FaEye
                  className="text-3xl ml-2 text-blue-600 hover:cursor-pointer hover:text-blue-700"
                  onClick={() => {
                    setIsPDFViewerDialogOpen(true);
                    setPDFUrl(pdfFile);
                  }}
                />
                <FaCloudDownloadAlt
                  className="text-3xl text-green-600 ml-2 hover:cursor-pointer"
                  onClick={() => handleDownload(pdfFile)}
                />
              </div>
            );
          })}

        <div className="flex ml-auto">
          <span className="text-end text-gray-700 mb-0 text-xs">
            {convertToTime(createdAt)}
          </span>
          {!(message.isDeleted === true) && (
            <span
              className={`text-end ${!isMessageRead ? "text-green-700" : "text-blue-700"} ml-1 text-sm`}
            >
              <IoIosCheckmarkCircle className="" />
            </span>
          )}
        </div>
      </div>

      {userInfo.avatar ? (
        <Avatar className="w-6 h-6">
          <AvatarImage src={userInfo.avatar} alt="@shadcn" />
          <AvatarFallback>{"S"}</AvatarFallback>
        </Avatar>
      ) : (
        <FaUserCircle className="text-gray-500 w-6 h-6" />
      )}

      {isMessageDialogOpen && message.isDeleted === undefined && (
        <MessageDialog
          isOpen={isMessageDialogOpen}
          setOpen={setIsMessageDialogOpen}
          messageId={messageId}
        />
      )}

      {isPDFViewerDialogOpen && (
        <PDFViewer
          isOpen={isPDFViewerDialogOpen}
          setIsOpen={setIsPDFViewerDialogOpen}
          pdfUrl={pdfUrl}
        />
      )}
    </div>
  );
};

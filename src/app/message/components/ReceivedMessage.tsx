import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export const ReceivedMessage = () => {
  const image = "";
  return (
    <div className="flex items-start space-x-2">
      <FaUserCircle className="text-gray-500 w-6 h-6" />
      <div className="flex flex-col bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-800">
        <span className="font-semibold">John Doe</span>
        <span>
          Hi John! I just wanted to follow up on the project proposal.
        </span>
        {image && <Image src=""
        height={200} width={200} alt="message" />}
      </div>
    </div>
  );
};

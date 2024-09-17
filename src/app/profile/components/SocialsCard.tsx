// SocialsCard.tsx

import React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export interface Socials {
  linkedIn?: string;
  github?: string;
  twitter?: string;
}

interface SocialsCardProps {
  socials: Socials | undefined; // Accept an object of social links
}

const SocialsCard: React.FC<SocialsCardProps> = ({ socials }) => {
  if (!socials) return <h1>No Socials.</h1>;

  return (
    <div className="mt-5">
      <h3 className="text-xl text-gray-950 font-bold">Connect with Me</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {socials.linkedIn && (
          <a
            href={socials.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <FaLinkedin className="text-white text-4xl mb-2" />
            <span className="text-white font-semibold">LinkedIn</span>
          </a>
        )}
        {socials.github && (
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <FaGithub className="text-white text-4xl mb-2" />
            <span className="text-white font-semibold">GitHub</span>
          </a>
        )}
        {socials.twitter && (
          <a
            href={socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <FaTwitter className="text-white text-4xl mb-2" />
            <span className="text-white font-semibold">Twitter</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default SocialsCard;

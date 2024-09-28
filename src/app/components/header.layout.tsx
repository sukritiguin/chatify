/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import Link from "next/link";
import {
  FaBell,
  FaBriefcase,
  FaEnvelope,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const commonDetails = useQuery(api.queries.getCommonDetails);

  const profiles = useQuery(api.queries.allProfileAndOrganizationProfile);

  const countUnreadConversations = useQuery(
    api.queries.countUnreadConversations
  );

  // Filter the profiles based on the search term
  const filteredProfiles = profiles
    ? profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle the search input change
  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo and Search Bar */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="text-xl font-bold text-blue-600 cursor-pointer uppercase">
                Chatify
              </div>
            </Link>
            <Input
              type="text"
              placeholder="Search..."
              className="w-80"
              value={searchTerm} // bind searchTerm state
              onChange={handleSearchChange} // call handler on input change
            />
          </div>

          {/* Icons and Avatar */}
          <div className="flex items-center space-x-6">
            <Link href="/feed">
              <FaHome className="text-gray-600 w-6 h-6 cursor-pointer" />
            </Link>
            <Link href="/network">
              <FaUsers className="text-gray-600 w-6 h-6 cursor-pointer" />
            </Link>
            <Link href="/jobs">
              <FaBriefcase className="text-gray-600 w-6 h-6 cursor-pointer" />
            </Link>
            <Link href="/notifications">
              <FaBell className="text-gray-600 w-6 h-6 cursor-pointer" />
            </Link>
            <div className="relative">
              <Link href="/message">
                <FaEnvelope className="text-gray-600 w-6 h-6 cursor-pointer" />
                {countUnreadConversations!==0 && (
                  <span className="absolute -top-3 left-4 flex items-center justify-center h-6 w-6 bg-red-500 text-white text-xs rounded-full">
                    {countUnreadConversations}
                  </span>
                )}
              </Link>
            </div>
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={commonDetails?.avatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>
      {searchTerm && (
        <div className="container mx-auto mt-2 bg-white border rounded-md shadow-md p-2">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <Link
                key={profile.userId}
                href={profile.profileUrl}
                className="flex items-center space-x-4 py-2 text-gray-800 px-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                <Avatar>
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{profile.name}</p>
                  <p className="text-xs text-gray-500">{profile?.bio}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              No profiles found
            </p>
          )}
        </div>
      )}
    </>
  );
};
